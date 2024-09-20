// utils/cdaGenerator.ts
import { dateGenerator, stringGenerator, cdaNumGenarator, numberStringGenerator, numberGenerator, charGenerator, nameGenerator, cnpjGenerator, cpfGenerator } from './utils';

interface Parte {
  nome: string;
  codContribuinte: string;
  cpfCnpj: string;
  rgIe: string;
  entregaEndereco: string;
  entregaBairro: string;
  entregaComplemento: string;
  entregaUf: string;
  entregaCEP: string;
  classificacao: string;
  tipoContato: string;    // Principal, Corresponsável, Contato;
  posicao: number;        // sequência entre todos os tipos de contato;
  seq: number;            // sequência entre o mesmo tipo de contato
};

interface ObjetoAcaoComposicao {
  codCda: string,
  codObj: number,
  parcelas: string,
  codObjAcao: number,
  exercicio: string,
  descricaoDivida: string,
  valorOriginal: string,
  valorPrincipal: string,
  valorMulta: string,
  valorJuros: string,
  valorCorrecao: string,
  vencimento: string,
  parcela: number,
  livro: number,
  folha: number,
  seq: string,
  fundamentoLegal: string,
  idParcela: string,
  descricao: string,
  sigla: string,
  codDivida: number,
  codSubdivida: string,
  codReceita: string,
  tipoCadastro: string,
  natureza: string
}

interface ObjetoAcao {
  codCda: string,
  codObj: number,
  qtdeParcelas: number,
  exercicio: string,
  parcela: number,
  subParcela: number,
  dataInscricao: string,
  idParcela: string,
  livro: 2,
  folha: 89,
  seq: string,
  principal: string,
  multas: string,
  juros: string,
  correcao: string,
  total: string,
  dataVencimento: string,
  fundamentoLegal: string,
  descricao: string,
  sigla: string,
  codDivida: number,
  codSubdivida: string,
  codReceita: string,
  tipoCadastro: string,
  natureza: string,
  objetoAcaoComposicao: ObjetoAcaoComposicao[]
}

interface CDA {
  pl1: string;
  codFinalidade: string;
  loteImport: string;
  inscricao: string;
  tipoCadastro: string;
  cdaNum: string;
  cdaData: string;
  endereco: string;
  bairro: string;
  complemento: string;
  cidade: string;
  uf: string;
  valor: string;
  quadra: string;
  lote: string;
  dataImport: string;
  idAjuizamento: string; //lote mandado pela empresa
  matricula: string;
  cep: string;
  processoAdm: string;
  observacao: string;
  partes: Parte[];
  cdasParcelamentos: [];
  objetoAcao: ObjetoAcao[];

};

const generateParte = (index: number): Parte => ({
  nome: nameGenerator(),
  codContribuinte: numberStringGenerator(100, 999),
  cpfCnpj: cpfGenerator(true) || cnpjGenerator(true),
  rgIe: numberStringGenerator(1000000, 9999999),
  entregaEndereco: 'Rua Exemplo, 456',
  entregaBairro: 'Bairro Exemplo',
  entregaComplemento: '',
  entregaUf: 'SP',
  entregaCEP: '15.803-000',
  classificacao: numberStringGenerator(1, 3),
  tipoContato: 'Principal',
  posicao: index + 1, // Assigning index-based position
  seq: 1,
});

const generateObjetoAcaoComposicao = (index: number): ObjetoAcaoComposicao => ({
  codCda: `CDA-${index + 1}`,
  codObj: index + 1,
  parcelas: `${numberStringGenerator(1, 12)}`,
  codObjAcao: index + 1,
  exercicio: String(new Date().getFullYear()),
  descricaoDivida: `Descrição da dívida ${index + 1}`,
  valorOriginal: `${numberStringGenerator(1000, 10000)},${numberStringGenerator(0, 99).padStart(2, '0')}`,
  valorPrincipal: `${numberStringGenerator(1000, 10000)},${numberStringGenerator(0, 99).padStart(2, '0')}`,
  valorMulta: '0,00',
  valorJuros: '0,00',
  valorCorrecao: '0,00',
  vencimento: dateGenerator().toISOString().split('T')[0],
  parcela: index + 1,
  livro: 2,
  folha: 89,
  seq: String(index + 1).padStart(4,'0'),
  fundamentoLegal: 'Lei XYZ',
  idParcela: `PARCELA-${index + 1}`,
  descricao: `IMPOSTO PREDIAL URBANO`,
  sigla: 'IPU',
  codDivida: numberGenerator(1, 999),
  codSubdivida: '',
  codReceita: '',
  tipoCadastro: 'IMOBILIARIO',
  natureza: 'Tributaria',
});


const generateObjetoAcao = (index: number, objetoAcaoComposicao: ObjetoAcaoComposicao[]): ObjetoAcao => ({
  codCda: `CDA-${index + 1}`,
  codObj: index + 1,
  qtdeParcelas: numberGenerator(1, 12),
  exercicio: String(new Date().getFullYear()),
  parcela: index + 1,
  subParcela: 0,
  dataInscricao: dateGenerator().toISOString().split('T')[0],
  idParcela: `PARCELA-${index + 1}`,
  livro: 2,
  folha: 89,
  seq: String(index + 1).padStart(4,'0'),
  principal: `${numberStringGenerator(1000, 10000)},${numberStringGenerator(0, 99).padStart(2, '0')}`,
  multas: '0,00',
  juros: '0,00',
  correcao: '0,00',
  total: `${numberStringGenerator(1000, 10000)},${numberStringGenerator(0, 99).padStart(2, '0')}`,
  dataVencimento: dateGenerator().toISOString().split('T')[0],
  fundamentoLegal: 'Lei XYZ',
  descricao: `IMPOSTO PREDIAL URBANO`,
  sigla: 'IPU',
  codDivida: numberGenerator(1, 999),
  codSubdivida: '',
  codReceita: '',
  tipoCadastro: 'IMOBILIARIO',
  natureza: 'Tributaria',
  objetoAcaoComposicao: objetoAcaoComposicao,
});


const cdaGenerator = (userData?: Partial<CDA>): CDA => {

  const cdaNum: string = (cdaNumGenarator.next().value as number).toString();
  const dateGenerated = dateGenerator();
  const day = String(dateGenerated.getDate()).padStart(2, '0');
  const month = String(dateGenerated.getMonth() + 1).padStart(2, '0');
  const year = dateGenerated.getFullYear();
  const formattedDate = `${day}/${month}/${year}`
  const formattedTime = `${dateGenerated.getHours()}:${dateGenerated.getMinutes()}:${dateGenerated.getSeconds()}`

  const partes = userData?.partes
    ? userData.partes.map((parte, index) => ({ ...parte, posicao: index + 1 }))
    : [generateParte(0), generateParte(1)];

  const cdasParcelamentos = userData?.cdasParcelamentos || [];

  const objetoAcao = userData?.objetoAcao || Array.from({ length: 2 }, (_, index) => {
    const composicao = userData?.objetoAcao?.[index]?.objetoAcaoComposicao || [generateObjetoAcaoComposicao(index)];
    return generateObjetoAcao(index, composicao);
  });

  return {
    pl1: userData?.pl1 || formattedDate,
    codFinalidade: userData?.codFinalidade || numberStringGenerator(1, 2),
    loteImport: userData?.loteImport || `${year}/${cdaNum.padStart(2, '0')}`,
    inscricao: userData?.inscricao || `${cdaNum.padStart(8, '0')}`,
    tipoCadastro: userData?.tipoCadastro || 'IMOBILIARIO',
    cdaNum: userData?.cdaNum || `${cdaNum.padStart(6, '0')}/${year}`,
    cdaData: userData?.cdaData || `${formattedDate} ${formattedTime}`,
    endereco: userData?.endereco || 'Avenida Exemplo, 123',
    bairro: userData?.bairro || 'Bairro Aleatório',
    complemento: userData?.complemento || '',
    cidade: userData?.cidade || 'Cidade Exemplo',
    uf: userData?.uf || 'SP',
    valor: userData?.valor || `${numberStringGenerator(1000, 10000)},${numberStringGenerator(0, 99).padStart(2, '0')}`,
    quadra: userData?.quadra || charGenerator(),
    lote: userData?.lote || `${numberStringGenerator(1, 9)}`,
    dataImport: userData?.dataImport || formattedDate,
    idAjuizamento: userData?.idAjuizamento || `${numberStringGenerator(1000, 10000)}`,
    matricula: userData?.matricula || '',
    cep: userData?.cep || '15.803-000',
    processoAdm: userData?.processoAdm || `${numberStringGenerator(1, 999)}/${year}`,
    observacao: userData?.observacao || '',
    partes: partes,
    cdasParcelamentos: [],
    objetoAcao: objetoAcao,
  };
};

const userSpecifiedData: Partial<CDA> = {
  endereco: 'Rua Personalizada, 50',
  uf: 'RJ'
};

export { cdaGenerator }
