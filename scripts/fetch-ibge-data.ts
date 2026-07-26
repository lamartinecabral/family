import { getSupabaseAdmin } from "../src/supabase.ts";
import { sobrenomeRanking, sobrenomeData, ufsData } from "../src/ibge.ts";

import type { Data } from "../src/supabase.ts";

const supabase = getSupabaseAdmin();

const fetchLocalidades = async () => {
  const res = await supabase.from("localidades").select("*").throwOnError();
  if (res.data && res.data.length > 0) {
    console.log("Localidades already fetched.");
    return res.data;
  }
  const localidades = await withRetry(() => ufsData());

  const br: (typeof localidades)[0] = {
    cod: 0,
    nome: "Brasil",
    uf: "BR",
    pop_local: localidades.reduce((acc, loc) => acc + loc.pop_local, 0),
  };
  localidades.unshift(br);

  await supabase.from("localidades").insert(localidades).throwOnError();
  console.log("Localidades fetched and inserted.");
  return localidades;
};

const fetchSobrenomes = async (
  localidades: Awaited<ReturnType<typeof fetchLocalidades>>,
) => {
  let page = 0;
  let keepFetching = true;

  const ufCod = keyValify(localidades, "uf", "cod");

  while (keepFetching) {
    page++;
    const ranking = await withRetry(() => sobrenomeRanking(page));

    const filters = ranking.map((item) => `nome.eq.${item.nome}`).join(",");
    const existent = (
      await supabase.from("sobrenomes").select("*").or(filters).throwOnError()
    ).data.map((item) => item.nome);

    for (const item of ranking) {
      if (existent.includes(item.nome)) {
        continue;
      }

      if (item.frequencia < 5180) {
        keepFetching = false;
        break;
      }

      try {
        const data = await withRetry(() => sobrenomeData(item.nome));

        await supabase
          .from("sobrenomes")
          .insert({ nome: item.nome })
          .throwOnError();

        const frequencias = [
          { nome: item.nome, localidade: 0, frequencia: data.frequencia },
          ...data.top_ufs.map((uf) => ({
            nome: item.nome,
            localidade: ufCod[uf.uf],
            frequencia: uf.frequencia,
          })),
        ];
        await supabase.from("frequencias").insert(frequencias).throwOnError();

        const frequencias_analise = getAnalysis(
          { frequencias, data },
          localidades,
        );
        await supabase
          .from("frequencias_analise")
          .insert(frequencias_analise)
          .throwOnError();

        console.log(
          `Sobrenome ${item.nome} inserted. (pop: ${item.frequencia})`,
        );
      } catch (error) {
        console.error(`Failed to process sobrenome ${item.nome}:`, error);
      }
    }
  }
};

const fetchUFSobrenomes = async (
  localidades: Awaited<ReturnType<typeof fetchLocalidades>>,
) => {
  const ufCod = keyValify(localidades, "uf", "cod");

  for (const localidade of localidades) {
    if (localidade.uf === "BR") continue;
    const cod = localidade.cod;
    let keepFetching = true;
    for (let page = 1; page <= 30 && keepFetching; page++) {
      try {
        console.log(`Fetching ranking for uf ${localidade.uf} on page ${page}`);
        const ranking = await withRetry(() => sobrenomeRanking(page, cod));
        if (ranking.length === 0) break;

        const filters = ranking.map((item) => `nome.eq.${item.nome}`).join(",");
        const existent = (
          await supabase
            .from("sobrenomes")
            .select("*")
            .or(filters)
            .throwOnError()
        ).data.map((item) => item.nome);

        for (const item of ranking) {
          if (existent.includes(item.nome)) {
            continue;
          }

          if (item.frequencia < 1000) {
            keepFetching = false;
            break;
          }

          const data = await withRetry(() => sobrenomeData(item.nome));

          await supabase
            .from("sobrenomes")
            .insert({ nome: item.nome })
            .throwOnError();

          const frequencias: Omit<Data<"frequencias">, "id">[] = [
            { nome: item.nome, localidade: 0, frequencia: data.frequencia },
            ...data.top_ufs.map((uf) => ({
              nome: item.nome,
              localidade: ufCod[uf.uf],
              frequencia: uf.frequencia,
            })),
          ];
          await supabase.from("frequencias").insert(frequencias).throwOnError();

          const frequencias_analise = getAnalysis(
            { frequencias, data },
            localidades,
          );
          await supabase
            .from("frequencias_analise")
            .insert(frequencias_analise)
            .throwOnError();

          console.log(
            `Sobrenome ${item.nome} inserted. (pop: ${item.frequencia})`,
          );
        }
      } catch (error) {
        console.error(
          `Failed to fetch ranking for uf ${localidade.uf} on page ${page}:`,
          error,
        );
      }
    }
  }
};

const getAnalysis = (
  sobrenome: {
    frequencias: Omit<Data<"frequencias">, "id">[];
    data: Awaited<ReturnType<typeof sobrenomeData>>;
  },
  localidades: Awaited<ReturnType<typeof fetchLocalidades>>,
) => {
  const { frequencias, data } = sobrenome;

  const populacaoBr = notNil(
    localidades.find((loc) => loc.uf === "BR"),
  ).pop_local;

  type FrequenciaAnalise = Omit<Data<"frequencias_analise">, "id">;
  const frequencias_analise: FrequenciaAnalise[] = frequencias
    .filter((f) => f.localidade !== 0)
    .map((f) => {
      const localidade = notNil(
        localidades.find((loc) => loc.cod === f.localidade),
      );

      // porcentagem do total de indivíduos do grupo no estado
      const share = f.frequencia / data.frequencia;

      // proporção do grupo no estado
      const concentracao = f.frequencia / localidade.pop_local;

      // Compara a proporção do grupo no estado com a proporção nacional
      const quociente_locacional =
        concentracao / (data.frequencia / populacaoBr);

      return {
        nome: f.nome,
        localidade: f.localidade,
        frequencia: f.frequencia,
        share,
        concentracao,
        quociente_locacional,
      };
    });

  return frequencias_analise;
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unreachable code");
};

const notNil = <T>(value: T | null | undefined): T => {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
  return value;
};

const keyValify = <T, K extends keyof T, V extends keyof T>(
  arr: T[],
  keyProp: K,
  valueProp: V,
) =>
  arr.reduce(
    (acc, item) => {
      acc[String(item[keyProp])] = item[valueProp];
      return acc;
    },
    {} as Record<string, T[V]>,
  );

async function main() {
  const localidades = await fetchLocalidades();
  await fetchSobrenomes(localidades);
  await fetchUFSobrenomes(localidades);
}

main().catch((error) => {
  console.error("Error in main execution:", error);
  process.exit(1);
});
