import { supabase } from "./supabase.ts";
import { sobrenomeRanking, sobrenomeData, ufsData } from "./ibge.ts";

const fetchLocalidades = async (): ReturnType<typeof ufsData> => {
  const res = await supabase.from("localidades").select("*");
  if (res.data && res.data.length > 0) {
    console.log("Localidades already fetched.");
    return res.data;
  }
  const localidades = await withRetry(() => ufsData());
  await supabase.from("localidades").insert(localidades);
  console.log("Localidades fetched and inserted.");
  return localidades;
};

const fetchSobrenomes = async () => {
  let page = 0;
  let keepFetching = true;

  while (keepFetching) {
    page++;
    const ranking = await withRetry(() => sobrenomeRanking(page));

    const filters = ranking.map((item) => `nome.eq.${item.nome}`).join(",");
    const existent =
      (await supabase.from("sobrenomes").select("*").or(filters)).data?.map(
        (item) => item.nome,
      ) || [];

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

        const doc: Record<string, any> = {
          nome: item.nome,
          freq_br: data.frequencia,
        };
        for (const uf of data.top_ufs) {
          doc[`freq_${uf.uf.toLowerCase()}`] = uf.frequencia;
        }
        await supabase.from("sobrenomes").insert(doc);

        console.log(
          `Sobrenome ${item.nome} inserted. (pop: ${item.frequencia})`,
        );
      } catch (error) {
        console.error(`Failed to process sobrenome ${item.nome}:`, error);
      }
    }
  }
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

const fetchUFSobrenomes = async () => {
  const localidades = await fetchLocalidades();
  for (const localidade of localidades) {
    const cod = localidade.cod;
    let keepFetching = true;
    for (let page = 1; page <= 30 && keepFetching; page++) {
      try {
        console.log(`Fetching ranking for uf ${localidade.uf} on page ${page}`);
        const ranking = await withRetry(() => sobrenomeRanking(page, cod));
        if (ranking.length === 0) break;

        const filters = ranking.map((item) => `nome.eq.${item.nome}`).join(",");
        const existent =
          (await supabase.from("sobrenomes").select("*").or(filters)).data?.map(
            (item) => item.nome,
          ) || [];

        for (const item of ranking) {
          if (existent.includes(item.nome)) {
            continue;
          }

          if (item.frequencia < 1000) {
            keepFetching = false;
            break;
          }

          const data = await withRetry(() => sobrenomeData(item.nome));

          const doc: Record<string, any> = {
            nome: item.nome,
            freq_br: data.frequencia,
          };
          for (const uf of data.top_ufs) {
            doc[`freq_${uf.uf.toLowerCase()}`] = uf.frequencia;
          }
          await supabase.from("sobrenomes").insert(doc);

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

async function main() {
  await fetchSobrenomes();
  await fetchUFSobrenomes();
}

main().catch((error) => {
  console.error("Error in main execution:", error);
  process.exit(1);
});
