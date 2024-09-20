// utils/cdaGenerator.ts
import { dateGenerator, stringGenerator, cdaNumGenarator, numberStringGenerator, charGenerator} from './utils';

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
    idAjuizamento: number;
    matricula: string;
    cep: string;
    processoAdm: string;
    observacao: string;
  };
  
  const cdaGenerator = (userData?: Partial<CDA>): CDA => {
    
    const cdaNum: string = (cdaNumGenarator.next().value as number).toString();
    const dateGenerated = dateGenerator();
    const day = String(dateGenerated.getDate()).padStart(2, '0');
    const month = String(dateGenerated.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = dateGenerated.getFullYear();
    const formattedDate = `${day}/${month}/${year}`
    const formattedTime = `${dateGenerated.getHours()}:${dateGenerated.getMinutes()}:${dateGenerated.getSeconds()}`  
    return {
      pl1: userData?.pl1 || formattedDate,
      codFinalidade: userData?.codFinalidade || numberStringGenerator(1, 4),
      loteImport: userData?.loteImport || `${year}/${cdaNum.padStart(2, '0')}`,
      inscricao: userData?.inscricao || `${cdaNum.padStart(8, '0')}`,
      tipoCadastro: userData?.tipoCadastro || 'IMOBILIARIO',
      cdaNum: userData?.cdaNum || `${cdaNum.padStart(6, '0')}/${year}`,
      cdaData: userData?.cdaData || `${formattedDate} ${formattedTime}` ,
      endereco: userData?.endereco || 'Avenida Exemplo, 123',
      bairro: userData?.bairro || 'Bairro Aleatório',
      complemento: userData?.complemento || '',
      cidade: userData?.cidade || 'Cidade Exemplo',
      uf: userData?.uf || 'SP',
      valor: userData?.valor || `${numberStringGenerator(1000, 10000)},${numberStringGenerator(0,99).padStart(2,'0')}`,
      quadra: userData?.quadra || charGenerator(),
      lote: userData?.lote || '5',
      dataImport: userData?.dataImport || formattedDate,
      idAjuizamento: userData?.idAjuizamento || 1,
      matricula: userData?.matricula || '',
      cep: userData?.cep || '15.803-000',
      processoAdm: userData?.processoAdm || `${numberStringGenerator(1, 999)}/${year}`,
      observacao: userData?.observacao || ''
    };
  };
  
  const userSpecifiedData: Partial<CDA> = {
    endereco: 'Rua Personalizada, 50',
    uf: 'RJ'
  };
  
  export { cdaGenerator }
  