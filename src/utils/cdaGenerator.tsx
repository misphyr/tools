// utils/cdaGenerator.ts
import { dateGenerator } from './dateGenerator';

export const cdaGenerator = () => {
    const data =
    {
        cdas: [
            {
                pl1: "03/06/2024",
                codFinalidade: "1",
                loteImport: "2024/00101",
                inscricao: "00000101",
                tipoCadastro: "IMOBILIARIO",
                cdaNum: "000801/2024",
                cdaData: "03/06/2024 08:18:20",
                endereco: "Avenida Benedito Zaneaner, 10",
                bairro: "Jardim Ipanema",
                complemento: "",
                cidade: "Catanduva",
                uf: "SP",
                valor: "2000,00",
                quadra: "B",
                lote: "5",
                dataImport: "03/06/2024",
                idAjuizamento: 1,
                matricula: "",
                cep: "15.803-000",
                processoAdm: "499/2024",
                observacao: "1483/2019,1484/2019,1487/2020,1490/2020",
                partes: [
                    {
                        nome: "Senhor Completo",
                        codContribuinte: "",
                        cpfCnpj: "70961230088",
                        rgIe: "431707017",
                        entregaEndereco: "Avenida Benedito Zaneaner, 10",
                        entregaBairro: "Jardim Ipanema",
                        entregaComplemento: "",
                        entregaCidade: "Catanduva",
                        entregaUf: "SP",
                        entregaCEP: "15.803-000",
                        classificacao: "2",
                        tipoContato: "Principal",
                        posicao: "1",
                        seq: "1"
                    }
                ],
                cdasParcelamentos: [],
                objetoAcao: [
                    {
                        codCda: "00101",
                        codObj: "911",
                        qtdeParcelas: "1",
                        exercicio: "2024",
                        parcela: "1",
                        subParcela: "1",
                        dataInscricao: "08/02/2024",
                        idParcela: "1319010",
                        livro: "2",
                        folha: "89",
                        seq: "0001",
                        principal: "1900,00",
                        multas: "20,00",
                        juros: "50,00",
                        correcao: "30,00",
                        total: "2000,00",
                        dataVencimento: "10/11/2024",
                        fundamentoLegal: "",
                        descricao: "IPTU",
                        sigla: "I",
                        codDivida: "100101",
                        codSubdivida: "",
                        codReceita: "",
                        tipoCadastro: "IMOBILIARIO",
                        natureza: "",
                        objetoAcaoComposicao: [
                            {
                                codCda: "00101",
                                codObj: "200",
                                parcelas: "1",
                                codObjAcao: "0",
                                exercicio: "2024",
                                descricaoDivida: "Imposto Predial Urbano",
                                valorOriginal: "2000",
                                valorPrincipal: "2000",
                                valorMulta: "0",
                                valorJuros: "0",
                                valorCorrecao: "0",
                                vencimento: "10/11/2024",
                                parcela: "1",
                                livro: "2",
                                folha: "89",
                                seq: "0001",
                                fundamentoLegal: "",
                                idParcela: "",
                                descricao: "IMPOSTO PREDIAL URBANO",
                                sigla: "IPU",
                                codDivida: "2",
                                codSubdivida: "",
                                codReceita: "",
                                tipoCadastro: "IMOBILIARIO",
                                natureza: "Tributaria"
                            }
                        ]
                    }
                ]
            }
        ]
    }



    return data;
};
