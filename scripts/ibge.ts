import z from "zod";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1500));

export const sobrenomeRanking = async (page = 1, localidade = 0) => {
  const url = `https://servicodados.ibge.gov.br/api/v3/nomes/2022/localidade/${localidade}/ranking/sobrenome?page=${page}`;
  await sleep();
  const response = await fetch(url);
  const data = await response.json();
  return z
    .object({
      items: z.array(z.object({ nome: z.string(), frequencia: z.number() })),
    })
    .parse(data).items;
};

export const sobrenomeData = async (sobrenome: string, localidade = 0) => {
  const url = `https://servicodados.ibge.gov.br/api/v3/nomes/2022/nome/${sobrenome}?tipo=sobrenome&localidade=${localidade}`;
  await sleep();
  const response = await fetch(url);
  const data = await response.json();
  return z
    .object({
      frequencia: z.number(),
      top_ufs: z.array(z.object({ uf: z.string(), frequencia: z.number() })),
    })
    .parse(data);
};

export const ufsData = async () => {
  const sobrenome = "silva";
  const localidade = 0;
  const url = `https://servicodados.ibge.gov.br/api/v3/nomes/2022/nome/${sobrenome}?tipo=sobrenome&localidade=${localidade}`;
  await sleep();
  const response = await fetch(url);
  const data = await response.json();
  return z
    .object({
      top_ufs: z.array(
        z.object({
          cod: z.number(),
          nome: z.string(),
          uf: z.string(),
          pop_local: z.number(),
        }),
      ),
    })
    .parse(data).top_ufs;
};
