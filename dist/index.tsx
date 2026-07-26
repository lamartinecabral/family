import React from "./react.mjs";

import {
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  TrendingUp,
  Users,
  Filter,
  Award,
  BookOpen,
  Sparkles,
  ArrowUpDown,
  X,
  Layers,
  ChevronRight,
  BarChart2,
  HelpCircle,
} from "./lucide-react.mjs";

import Supabase from "./supabase.mjs";
import type { Database } from "../scripts/supabase.types.ts";

const projectId = "";
const supabaseKey = "";

const supabase = Supabase.createClient<Database>(
  `https://${projectId}.supabase.co`,
  supabaseKey,
);

type Localidade = {
  uf: string;
  nome: string;
  pop_local: number;
  regiao: string;
};

type Frequencia = {
  sobrenome: string;
  uf: string;
  frequencia: number;
  quociente_locacional: number;
  origem: string;
};

const LOCALIDADES: Localidade[] = [
  { uf: "AC", nome: "Acre", pop_local: 830026, regiao: "Norte" },
  { uf: "AL", nome: "Alagoas", pop_local: 3127511, regiao: "Nordeste" },
  { uf: "AP", nome: "Amapá", pop_local: 733508, regiao: "Norte" },
  { uf: "AM", nome: "Amazonas", pop_local: 3941175, regiao: "Norte" },
  { uf: "BA", nome: "Bahia", pop_local: 14136417, regiao: "Nordeste" },
  { uf: "CE", nome: "Ceará", pop_local: 8791688, regiao: "Nordeste" },
  {
    uf: "DF",
    nome: "Distrito Federal",
    pop_local: 2817068,
    regiao: "Centro-Oeste",
  },
  { uf: "ES", nome: "Espírito Santo", pop_local: 3833486, regiao: "Sudeste" },
  { uf: "GO", nome: "Goiás", pop_local: 7055228, regiao: "Centro-Oeste" },
  { uf: "MA", nome: "Maranhão", pop_local: 6775805, regiao: "Nordeste" },
  { uf: "MT", nome: "Mato Grosso", pop_local: 3658813, regiao: "Centro-Oeste" },
  {
    uf: "MS",
    nome: "Mato Grosso do Sul",
    pop_local: 2756700,
    regiao: "Centro-Oeste",
  },
  { uf: "MG", nome: "Minas Gerais", pop_local: 20538718, regiao: "Sudeste" },
  { uf: "PA", nome: "Pará", pop_local: 8116132, regiao: "Norte" },
  { uf: "PB", nome: "Paraíba", pop_local: 3974495, regiao: "Nordeste" },
  { uf: "PR", nome: "Paraná", pop_local: 11443208, regiao: "Sul" },
  { uf: "PE", nome: "Pernambuco", pop_local: 9058155, regiao: "Nordeste" },
  { uf: "PI", nome: "Piauí", pop_local: 3269200, regiao: "Nordeste" },
  { uf: "RJ", nome: "Rio de Janeiro", pop_local: 16054524, regiao: "Sudeste" },
  {
    uf: "RN",
    nome: "Rio Grande do Norte",
    pop_local: 3302406,
    regiao: "Nordeste",
  },
  { uf: "RS", nome: "Rio Grande do Sul", pop_local: 10880506, regiao: "Sul" },
  { uf: "RO", nome: "Rondônia", pop_local: 1581016, regiao: "Norte" },
  { uf: "RR", nome: "Roraima", pop_local: 636303, regiao: "Norte" },
  { uf: "SC", nome: "Santa Catarina", pop_local: 7609601, regiao: "Sul" },
  { uf: "SP", nome: "São Paulo", pop_local: 44420459, regiao: "Sudeste" },
  { uf: "SE", nome: "Sergipe", pop_local: 2209558, regiao: "Nordeste" },
  { uf: "TO", nome: "Tocantins", pop_local: 1511459, regiao: "Norte" },
];

const POPULACAO_BRASIL = LOCALIDADES.reduce(
  (acc, curr) => acc + curr.pop_local,
  0,
);

/* Raw surname data profiles with strong state/regional concentrations */
const SURNAME_PROFILES = [
  {
    sobrenome: "Kaxinawá",
    baseFreq: 4800,
    mainUf: "AC",
    mainShare: 0.88,
    origin: "Indígena (Panos)",
  },
  {
    sobrenome: "Gondim",
    baseFreq: 32000,
    mainUf: "CE",
    mainShare: 0.52,
    origin: "Português / Nordestino",
  },
  {
    sobrenome: "Schneider",
    baseFreq: 142000,
    mainUf: "SC",
    mainShare: 0.38,
    origin: "Germânico (Sul)",
  },
  {
    sobrenome: "Takahashi",
    baseFreq: 45000,
    mainUf: "SP",
    mainShare: 0.65,
    origin: "Japonês (Sudeste)",
  },
  {
    sobrenome: "Linhares",
    baseFreq: 68000,
    mainUf: "CE",
    mainShare: 0.44,
    origin: "Português / Cearense",
  },
  {
    sobrenome: "Kopp",
    baseFreq: 22000,
    mainUf: "RS",
    mainShare: 0.58,
    origin: "Germânico (Gaúcho)",
  },
  {
    sobrenome: "Sobral",
    baseFreq: 38000,
    mainUf: "SE",
    mainShare: 0.42,
    origin: "Ibérico / Sergipano",
  },
  {
    sobrenome: "Holanda",
    baseFreq: 110000,
    mainUf: "CE",
    mainShare: 0.51,
    origin: "Neerlandês / Cearense",
  },
  {
    sobrenome: "Medeiros",
    baseFreq: 290000,
    mainUf: "RN",
    mainShare: 0.36,
    origin: "Açoriano / Potiguar",
  },
  {
    sobrenome: "Bressan",
    baseFreq: 31000,
    mainUf: "SC",
    mainShare: 0.49,
    origin: "Italiano (Catarinense)",
  },
  {
    sobrenome: "Cavalcante",
    baseFreq: 420000,
    mainUf: "CE",
    mainShare: 0.32,
    origin: "Italiano / Nordestino",
  },
  {
    sobrenome: "Steffen",
    baseFreq: 19000,
    mainUf: "RS",
    mainShare: 0.62,
    origin: "Germânico",
  },
  {
    sobrenome: "Sato",
    baseFreq: 62000,
    mainUf: "SP",
    mainShare: 0.68,
    origin: "Japonês",
  },
  {
    sobrenome: "Zimmermann",
    baseFreq: 28000,
    mainUf: "SC",
    mainShare: 0.54,
    origin: "Germânico",
  },
  {
    sobrenome: "Wanderley",
    baseFreq: 49000,
    mainUf: "PE",
    mainShare: 0.45,
    origin: "Holandês / Pernambucano",
  },
  {
    sobrenome: "Diniz",
    baseFreq: 185000,
    mainUf: "MA",
    mainShare: 0.31,
    origin: "Português",
  },
  {
    sobrenome: "Aragão",
    baseFreq: 92000,
    mainUf: "CE",
    mainShare: 0.39,
    origin: "Ibérico",
  },
  {
    sobrenome: "Rossi",
    baseFreq: 165000,
    mainUf: "SP",
    mainShare: 0.48,
    origin: "Italiano",
  },
  {
    sobrenome: "Fischer",
    baseFreq: 54000,
    mainUf: "SC",
    mainShare: 0.46,
    origin: "Germânico",
  },
  {
    sobrenome: "Guerra",
    baseFreq: 115000,
    mainUf: "PE",
    mainShare: 0.35,
    origin: "Ibérico",
  },
  {
    sobrenome: "Lins",
    baseFreq: 130000,
    mainUf: "PE",
    mainShare: 0.41,
    origin: "Alemão-Açoriano",
  },
  {
    sobrenome: "Sampaio",
    baseFreq: 210000,
    mainUf: "BA",
    mainShare: 0.38,
    origin: "Português",
  },
  {
    sobrenome: "Azevedo",
    baseFreq: 380000,
    mainUf: "RJ",
    mainShare: 0.28,
    origin: "Português",
  },
  {
    sobrenome: "Brito",
    baseFreq: 520000,
    mainUf: "BA",
    mainShare: 0.29,
    origin: "Português",
  },
  {
    sobrenome: "Aguiar",
    baseFreq: 240000,
    mainUf: "CE",
    mainShare: 0.33,
    origin: "Português",
  },
  {
    sobrenome: "Silva",
    baseFreq: 10200000,
    mainUf: "SP",
    mainShare: 0.21,
    origin: "Nacional (Muito comum)",
  },
  {
    sobrenome: "Santos",
    baseFreq: 7800000,
    mainUf: "BA",
    mainShare: 0.23,
    origin: "Nacional (Muito comum)",
  },
  {
    sobrenome: "Oliveira",
    baseFreq: 5400000,
    mainUf: "MG",
    mainShare: 0.2,
    origin: "Nacional (Muito comum)",
  },
  {
    sobrenome: "Souza",
    baseFreq: 4900000,
    mainUf: "BA",
    mainShare: 0.19,
    origin: "Nacional (Muito comum)",
  },
  {
    sobrenome: "Lima",
    baseFreq: 3800000,
    mainUf: "CE",
    mainShare: 0.22,
    origin: "Nacional",
  },
];

/**
 * Generates full realistic table of Frequencia across all UFs
 * Calculates Quociente Locacional (QL):
 * QL = (Freq_UF / Pop_UF) / (Freq_BR / Pop_BR)
 */
const generateMockDatabase = () => {
  const frequencias: Frequencia[] = [];

  SURNAME_PROFILES.forEach((profile) => {
    const totalFreqBr = profile.baseFreq;
    const mainState =
      LOCALIDADES.find((l) => l.uf === profile.mainUf) || LOCALIDADES[0];

    // Calculate main state frequency based on specified share
    const mainFreq = Math.round(totalFreqBr * profile.mainShare);
    let remainingFreq = totalFreqBr - mainFreq;

    // Distribute remaining frequency across other UFs proportional to population with random variance
    const otherStates = LOCALIDADES.filter((l) => l.uf !== profile.mainUf);
    const otherPopTotal = otherStates.reduce(
      (acc, curr) => acc + curr.pop_local,
      0,
    );

    const stateFreqs: Record<string, number> = {};
    stateFreqs[profile.mainUf] = mainFreq;

    otherStates.forEach((st, idx) => {
      if (idx === otherStates.length - 1) {
        stateFreqs[st.uf] = Math.max(10, remainingFreq);
      } else {
        const prop = st.pop_local / otherPopTotal;
        const noise = 0.5 + Math.sin(profile.sobrenome.length + idx) * 0.4;
        const calculated = Math.round(remainingFreq * prop * noise);
        const allocated = Math.min(remainingFreq, Math.max(5, calculated));
        stateFreqs[st.uf] = allocated;
        remainingFreq -= allocated;
      }
    });

    // Calculate actual total sum generated
    const actualTotalBr = Object.values(stateFreqs).reduce((a, b) => a + b, 0);
    const nationalRate = actualTotalBr / POPULACAO_BRASIL;

    // Build Frequencia objects for each UF
    LOCALIDADES.forEach((loc) => {
      const count = stateFreqs[loc.uf] || 10;
      const localRate = count / loc.pop_local;
      const ql = Number((localRate / nationalRate).toFixed(2));

      frequencias.push({
        sobrenome: profile.sobrenome,
        uf: loc.uf,
        frequencia: count,
        quociente_locacional: ql,
        origem: profile.origin,
      });
    });
  });

  return frequencias;
};

const FREQUENCIAS_DB = generateMockDatabase();

export default function App() {
  const [selectedUf, setSelectedUf] = React.useState("CE");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedSurname, setExpandedSurname] = React.useState<string | null>(
    null,
  );
  const [minQlFilter, setMinQlFilter] = React.useState(1.0);
  const [sortBy, setSortBy] = React.useState("ql"); // 'ql' or 'freq'
  const [selectedRegion, setSelectedRegion] = React.useState("Todas");
  const [showInfoModal, setShowInfoModal] = React.useState(false);

  /* Current State metadata */
  const currentStateInfo = React.useMemo(() => {
    return LOCALIDADES.find((l) => l.uf === selectedUf) || LOCALIDADES[0];
  }, [selectedUf]);

  /* Filtered list of UFs for header quick selection */
  const filteredStates = React.useMemo(() => {
    if (selectedRegion === "Todas") return LOCALIDADES;
    return LOCALIDADES.filter((l) => l.regiao === selectedRegion);
  }, [selectedRegion]);

  /* Ranking table calculation for selected UF */
  const stateRanking = React.useMemo(() => {
    let list = FREQUENCIAS_DB.filter((f) => f.uf === selectedUf);

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((item) => item.sobrenome.toLowerCase().includes(term));
    }

    if (minQlFilter > 1.0) {
      list = list.filter((item) => item.quociente_locacional >= minQlFilter);
    }

    list.sort((a, b) => {
      if (sortBy === "ql") {
        return b.quociente_locacional - a.quociente_locacional;
      }
      return b.frequencia - a.frequencia;
    });

    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
      percentLocal: (
        (item.frequencia / currentStateInfo.pop_local) *
        100
      ).toFixed(3),
    }));
  }, [selectedUf, searchTerm, minQlFilter, sortBy, currentStateInfo]);

  /* Top typical surname stats for dashboard highlight */
  const topTypicalSurname = React.useMemo(() => {
    if (stateRanking.length === 0) return null;
    return stateRanking[0];
  }, [stateRanking]);

  /* Total statistics for current state */
  const totalAnalyzedInUf = React.useMemo(() => {
    return FREQUENCIAS_DB.filter((f) => f.uf === selectedUf).reduce(
      (acc, curr) => acc + curr.frequencia,
      0,
    );
  }, [selectedUf]);

  /* Helper to toggle row expansion */
  const toggleExpand = (sobrenome: string) => {
    if (expandedSurname === sobrenome) {
      setExpandedSurname(null);
    } else {
      setExpandedSurname(sobrenome);
    }
  };

  const renderNationwideDetails = (sobrenome: string) => {
    const allStateData = FREQUENCIAS_DB.filter((f) => f.sobrenome === sobrenome)
      .map((item) => {
        const stateLoc = LOCALIDADES.find((l) => l.uf === item.uf);
        return {
          ...item,
          nomeEstado: stateLoc ? stateLoc.nome : item.uf,
          popEstado: stateLoc ? stateLoc.pop_local : 1,
          percentState: (
            (item.frequencia / (stateLoc ? stateLoc.pop_local : 1)) *
            100
          ).toFixed(3),
        };
      })
      .sort((a, b) => b.quociente_locacional - a.quociente_locacional);

    const totalBrasilCount = allStateData.reduce((a, b) => a + b.frequencia, 0);
    const top5States = allStateData.slice(0, 5);
    const maxQl = Math.max(...allStateData.map((d) => d.quociente_locacional));

    return (
      <div className="bg-slate-50 border-t-2 border-amber-400 p-4 md:p-6 rounded-b-lg space-y-6 animate-fadeIn">
        {/* Detail Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-800">
                {sobrenome}
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-300">
                Panorama Nacional
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Presente em todos os 27 estados. Total estimado no Brasil:{" "}
              <strong className="text-slate-900">
                {totalBrasilCount.toLocaleString("pt-BR")}
              </strong>{" "}
              pessoas.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs md:text-sm">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center">
              <span className="block text-slate-500 text-[10px] uppercase tracking-wider">
                Estado com Maior QL
              </span>
              <strong className="text-blue-900 text-base">
                {top5States[0]?.uf} ({top5States[0]?.quociente_locacional}x)
              </strong>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center">
              <span className="block text-slate-500 text-[10px] uppercase tracking-wider">
                Média Nacional
              </span>
              <strong className="text-emerald-900 text-base">
                {((totalBrasilCount / POPULACAO_BRASIL) * 100).toFixed(3)}%
              </strong>
            </div>
          </div>
        </div>

        {/* Top Concentrated States Bar Visual */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-blue-800" />
            Top 5 Estados com maior Quociente Locacional para "{sobrenome}"
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {top5States.map((st) => {
              const isCurrent = st.uf === selectedUf;
              const barHeightPct = Math.min(
                100,
                Math.max(15, (st.quociente_locacional / maxQl) * 100),
              );
              return (
                <div
                  key={st.uf}
                  className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? "bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-amber-400 ring-offset-1"
                      : "bg-white border-slate-200 hover:border-blue-300 text-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${isCurrent ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-700"}`}
                    >
                      {st.uf}
                    </span>
                    <span
                      className={`text-xs font-semibold ${isCurrent ? "text-amber-300" : "text-blue-800"}`}
                    >
                      {st.quociente_locacional}x
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="text-sm font-bold truncate">
                      {st.nomeEstado}
                    </div>
                    <div
                      className={`text-[11px] ${isCurrent ? "text-blue-200" : "text-slate-500"}`}
                    >
                      {st.frequencia.toLocaleString("pt-BR")} pessoas (
                      {st.percentState}%)
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${isCurrent ? "bg-amber-400" : "bg-blue-800"}`}
                      style={{ width: `${barHeightPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complete State Table View */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-800" />
              Distribuição Completa pelas 27 Unidades da Federação
            </h4>
            <span className="text-[11px] text-slate-500">
              Ordenado por Quociente Locacional
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-inner">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2 text-right">Pessoas</th>
                  <th className="px-3 py-2 text-right">% Pop. Local</th>
                  <th className="px-3 py-2 text-right">
                    Quociente Locacional (QL)
                  </th>
                  <th className="px-3 py-2">Classificação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allStateData.map((st) => {
                  const isSelected = st.uf === selectedUf;
                  let badgeColor = "bg-slate-100 text-slate-600";
                  let qlText = "Típico";

                  if (st.quociente_locacional >= 4.0) {
                    badgeColor =
                      "bg-amber-100 text-amber-900 border border-amber-300 font-bold";
                    qlText = "Extremamente Típico";
                  } else if (st.quociente_locacional >= 2.0) {
                    badgeColor =
                      "bg-blue-100 text-blue-900 border border-blue-200 font-semibold";
                    qlText = "Muito Típico";
                  } else if (st.quociente_locacional >= 1.2) {
                    badgeColor = "bg-emerald-50 text-emerald-800";
                    qlText = "Acima da Média";
                  } else if (st.quociente_locacional < 0.8) {
                    badgeColor = "bg-slate-100 text-slate-400";
                    qlText = "Sub-representado";
                  }

                  return (
                    <tr
                      key={st.uf}
                      className={`hover:bg-blue-50/50 ${isSelected ? "bg-amber-50 font-medium" : ""}`}
                    >
                      <td className="px-3 py-2 flex items-center gap-2">
                        <span
                          className={`w-6 text-center font-bold px-1 rounded text-[10px] ${isSelected ? "bg-blue-900 text-white" : "bg-slate-200 text-slate-700"}`}
                        >
                          {st.uf}
                        </span>
                        <span>{st.nomeEstado}</span>
                        {isSelected && (
                          <span className="text-[10px] text-amber-700 font-semibold">
                            (Estado Selecionado)
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-mono">
                        {st.frequencia.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-3 py-2 text-right font-mono">
                        {st.percentState}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                        {st.quociente_locacional}x
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${badgeColor}`}
                        >
                          {qlText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased pb-12">
      {/* Official IBGE-Style Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b-4 border-amber-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* IBGE Nomes Branding Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-400 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl md:text-2xl shadow-md tracking-tighter">
                IBGE
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                    Censo Demográfico 2022
                  </span>
                  <span className="text-[10px] bg-blue-800 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700">
                    Módulo Sobrenomes
                  </span>
                </div>
                <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                  As famílias típicas de cada estado
                </h1>
              </div>
            </div>

            {/* Header Action / Info Trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex items-center gap-2 bg-blue-900/80 hover:bg-blue-800 text-amber-300 border border-blue-700/80 px-3.5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>O que é Quociente Locacional?</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* State Selector & Region Filters Bar */}
        <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-800" />
                Selecione a Unidade da Federação
              </h2>
              <p className="text-xs text-slate-500">
                Explore os sobrenomes com maior concentração comparativa em
                relação à média brasileira.
              </p>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium mr-1">
                Região:
              </span>
              {[
                "Todas",
                "Norte",
                "Nordeste",
                "Centro-Oeste",
                "Sudeste",
                "Sul",
              ].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium ${
                    selectedRegion === reg
                      ? "bg-blue-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Quick UF Selector Grid */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 max-h-36 overflow-y-auto p-1">
            {filteredStates.map((st) => {
              const isSelected = st.uf === selectedUf;
              return (
                <button
                  key={st.uf}
                  onClick={() => {
                    setSelectedUf(st.uf);
                    setExpandedSurname(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${isSelected ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {st.uf}
                  </span>
                  <span>{st.nome}</span>
                </button>
              );
            })}
          </div>
        </section>

        {}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Active State Card */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-5 rounded-xl shadow-md border-l-4 border-amber-400 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                  Estado Analisado
                </span>
                <h3 className="text-2xl font-black text-white">
                  {currentStateInfo.nome} ({currentStateInfo.uf})
                </h3>
              </div>
              <span className="bg-blue-800 text-blue-200 text-xs px-2.5 py-1 rounded-full font-medium">
                {currentStateInfo.regiao}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-800/60 flex items-center justify-between text-xs text-blue-200">
              <span>População Censo 2022:</span>
              <strong className="text-white text-sm font-mono">
                {currentStateInfo.pop_local.toLocaleString("pt-BR")} hab.
              </strong>
            </div>
          </div>

          {/* Top Overrepresented Surname */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Sobrenome Mais Típico
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <h4 className="text-2xl font-black text-slate-900">
                  {topTypicalSurname ? topTypicalSurname.sobrenome : "—"}
                </h4>
                {topTypicalSurname && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {topTypicalSurname.quociente_locacional}x
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {topTypicalSurname
                ? `O sobrenome mais concentrado em ${currentStateInfo.uf} comparado à média nacional.`
                : "Nenhum resultado para os filtros atuais."}
            </p>
          </div>

          {/* Highest Location Quotient Value */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                Maior Quociente Locacional
              </span>
              <div className="mt-1">
                <span className="text-2xl font-black text-blue-900">
                  {topTypicalSurname
                    ? `${topTypicalSurname.quociente_locacional}x`
                    : "0x"}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  a média nacional
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Valores acima de 1.0x indicam presença superior ao padrão do
              Brasil.
            </p>
          </div>

          {/* Total Sampled in Database */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Amostra Mapeada em {currentStateInfo.uf}
              </span>
              <div className="mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {totalAnalyzedInUf.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-slate-500 ml-1">pessoas</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Somatório das famílias em destaque no banco do Censo.
            </p>
          </div>
        </section>

        {}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Control Bar */}
          <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Ranking das Famílias Típicas de {currentStateInfo.nome} (
                  {currentStateInfo.uf})
                </h3>
                <p className="text-xs text-slate-500">
                  Sobrenomes ordenados pelo Quociente Locacional (QL). Clique na
                  linha para abrir o mapa nacional da família.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar sobrenome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-filters & Sort options */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 text-xs">
              <div className="flex items-center gap-4">
                {/* Min QL Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-700">
                    Filtrar por QL mínimo:
                  </span>
                  <select
                    value={minQlFilter}
                    onChange={(e) => setMinQlFilter(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-800 font-medium"
                  >
                    <option value={1.0}>Todos (QL &ge; 1.0)</option>
                    <option value={1.5}>Relevantes (QL &ge; 1.5x)</option>
                    <option value={2.0}>Muito Típicos (QL &ge; 2.0x)</option>
                    <option value={3.0}>Hiper Típicos (QL &ge; 3.0x)</option>
                  </select>
                </div>
              </div>

              {/* Sort By Toggle */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Ordenar por:
                </span>
                <button
                  onClick={() => setSortBy("ql")}
                  className={`px-3 py-1 rounded transition-all font-medium ${
                    sortBy === "ql"
                      ? "bg-blue-900 text-white shadow-sm"
                      : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Quociente Locacional (QL)
                </button>
                <button
                  onClick={() => setSortBy("freq")}
                  className={`px-3 py-1 rounded transition-all font-medium ${
                    sortBy === "freq"
                      ? "bg-blue-900 text-white shadow-sm"
                      : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Frequência Absoluta
                </button>
              </div>
            </div>
          </div>

          {}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Sobrenome</th>
                  <th className="py-3 px-4">Origem Predominante</th>
                  <th className="py-3 px-4 text-right">
                    Pessoas em {currentStateInfo.uf}
                  </th>
                  <th className="py-3 px-4 text-right">% População</th>
                  <th className="py-3 px-4 text-right">Quociente Locacional</th>
                  <th className="py-3 px-4 w-28 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {stateRanking.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-500 bg-white"
                    >
                      <p className="font-semibold">
                        Nenhum sobrenome encontrado com os filtros selecionados.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setMinQlFilter(1.0);
                        }}
                        className="mt-2 text-xs text-blue-800 underline hover:text-blue-900 font-medium"
                      >
                        Limpar todos os filtros
                      </button>
                    </td>
                  </tr>
                ) : (
                  stateRanking.map((row) => {
                    const isExpanded = expandedSurname === row.sobrenome;

                    /* Visual indicator color according to QL intensity */
                    let qlBadgeClass =
                      "bg-slate-100 text-slate-700 border-slate-200";
                    let qlIcon = null;

                    if (row.quociente_locacional >= 4.0) {
                      qlBadgeClass =
                        "bg-amber-100 text-amber-900 border-amber-300 font-black shadow-sm";
                      qlIcon = (
                        <Sparkles className="w-3 h-3 text-amber-600 inline mr-1" />
                      );
                    } else if (row.quociente_locacional >= 2.0) {
                      qlBadgeClass =
                        "bg-blue-100 text-blue-950 border-blue-200 font-bold";
                    } else if (row.quociente_locacional >= 1.3) {
                      qlBadgeClass =
                        "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold";
                    }

                    return (
                      <React.Fragment key={row.sobrenome}>
                        {/* Table Main Row */}
                        <tr
                          onClick={() => toggleExpand(row.sobrenome)}
                          className={`cursor-pointer transition-colors hover:bg-amber-50/60 ${
                            isExpanded
                              ? "bg-amber-50 font-medium border-l-4 border-amber-500"
                              : "bg-white"
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                            {row.rank <= 3 ? (
                              <span
                                className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black ${
                                  row.rank === 1
                                    ? "bg-amber-400 text-slate-950 shadow-sm"
                                    : row.rank === 2
                                      ? "bg-slate-300 text-slate-900"
                                      : "bg-amber-700/20 text-amber-900"
                                }`}
                              >
                                {row.rank}
                              </span>
                            ) : (
                              row.rank
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 text-base">
                            {row.sobrenome}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {row.origem || "Ibérico"}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-800">
                            {row.frequencia.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-600">
                            {row.percentLocal}%
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs border ${qlBadgeClass}`}
                            >
                              {qlIcon}
                              {row.quociente_locacional}x
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(row.sobrenome);
                              }}
                              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                                isExpanded
                                  ? "bg-blue-900 text-white border-blue-900"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                              }`}
                            >
                              <span>
                                {isExpanded ? "Fechar" : "Ver Brasil"}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Detail Panel across all States */}
                        {isExpanded && (
                          <tr>
                            <td
                              colSpan={7}
                              className="p-0 border-b border-slate-300"
                            >
                              {renderNationwideDetails(row.sobrenome)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              Mostrando <strong>{stateRanking.length}</strong> sobrenomes
              analisados para o estado de{" "}
              <strong>{currentStateInfo.nome}</strong>.
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <BookOpen className="w-3.5 h-3.5" />
              Fonte: Dados estruturados com base no Censo Demográfico do IBGE.
            </div>
          </div>
        </section>
      </main>

      {showInfoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-900">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  O que é Quociente Locacional (QL)?
                </h3>
                <p className="text-xs text-slate-500">
                  Metodologia de Análise Geográfica de Nomes
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>
                O <strong>Quociente Locacional (QL)</strong> é uma medida
                estatística utilizada para identificar a hiper-representação
                regional de um determinado sobrenome em relação ao padrão médio
                nacional do Brasil.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px] text-slate-800">
                <div className="font-bold text-blue-900">
                  Fórmula do Quociente Locacional:
                </div>
                <div className="p-2 bg-white rounded border border-slate-200 text-center">
                  QL = ( Frequência no Estado / População do Estado ) / (
                  Frequência no Brasil / População do Brasil )
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">
                  Como interpretar o resultado:
                </h4>
                <ul className="space-y-1.5 list-disc pl-4">
                  <li>
                    <strong className="text-amber-800">QL &gt; 1.0:</strong> O
                    sobrenome é <strong>mais concentrado</strong> no estado do
                    que na média do país. Por exemplo, um QL de 3.5x significa
                    que o nome é 3,5 vezes mais comum naquele estado do que no
                    Brasil em geral.
                  </li>
                  <li>
                    <strong className="text-slate-800">QL = 1.0:</strong> O
                    sobrenome tem exatamente a mesma proporção local que a média
                    nacional.
                  </li>
                  <li>
                    <strong className="text-slate-500">QL &lt; 1.0:</strong> O
                    sobrenome é sub-representado na Unidade da Federação.
                  </li>
                </ul>
              </div>

              <p className="text-slate-500 italic text-[11px] border-t border-slate-100 pt-3">
                Essa métrica permite revelar raízes de imigração histórica,
                povoamento indígena regional e clãs familiares típicos de cada
                estado brasileiro sem ser ofuscado por nomes ultra comuns de
                alcance nacional (como Silva ou Santos).
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer IBGE inspired */}
      <footer className="mt-12 text-center text-xs text-slate-500 border-t border-slate-200 pt-6">
        <p className="font-semibold text-slate-700">
          As famílias típicas de cada estado — Censo Demográfico 2022
        </p>
        <p className="mt-1">
          Inspirado na identidade visual do Portal de Nomes do IBGE
        </p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
