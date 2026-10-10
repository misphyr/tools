export type ToolCategory = 'utils' | 'geradores' | 'validadores' | 'aleatorios';

export interface Tool {
  title: string;
  shortTitle: string;
  description: string;
  path: string;
}

export interface ToolSection {
  category: ToolCategory;
  label: string;
  singular: string;
  tools: Tool[];
}

export const toolSections: ToolSection[] = [
  {
    category: 'geradores',
    label: 'Geradores',
    singular: 'Gerador',
    tools: [
      { title: 'Gerar CPF/CNPJ', shortTitle: 'CPF/CNPJ', description: 'Documentos válidos para testes', path: '/geradores/cpf-cnpj' },
      { title: 'Gerar CEP', shortTitle: 'CEP', description: 'CEPs reais com endereço', path: '/geradores/cep' },
      { title: 'Gerar UUID', shortTitle: 'UUID', description: 'UUIDs v4 e v7 em lote', path: '/geradores/uuid' },
      { title: 'Gerar Cores', shortTitle: 'Cores', description: 'Paletas aleatórias e harmônicas', path: '/geradores/cores' },
      { title: 'Gerar Chaves SSH', shortTitle: 'Chaves SSH', description: 'Pares Ed25519 e RSA no formato OpenSSH', path: '/geradores/ssh' },
    ],
  },
  {
    category: 'validadores',
    label: 'Validadores',
    singular: 'Validador',
    tools: [
      { title: 'Validar CPF/CNPJ', shortTitle: 'CPF/CNPJ', description: 'Confere os dígitos verificadores', path: '/validadores/cpf-cnpj' },
      { title: 'Validar CEP', shortTitle: 'CEP', description: 'Consulta o endereço no ViaCEP', path: '/validadores/cep' },
      { title: 'Força de Senha', shortTitle: 'Força de Senha', description: 'Entropia, tempo para quebrar e vazamentos', path: '/validadores/senha' },
    ],
  },
  {
    category: 'utils',
    label: 'Utilitários',
    singular: 'Utilitário',
    tools: [
      { title: 'Formatar Texto', shortTitle: 'Formatar Texto', description: 'Conta, limpa e sanitiza textos', path: '/utils/caracteres' },
      { title: 'Strings de Teste', shortTitle: 'Strings de Teste', description: 'Textos com emoji, acento, zalgo e RTL para testar campos', path: '/utils/strings' },
      { title: 'Indentador de Arquivo', shortTitle: 'Indentador', description: 'Indenta JSON, XML, HTML, CSS e JS', path: '/utils/indentador' },
      { title: 'Gerador Lorem Ipsum', shortTitle: 'Lorem Ipsum', description: 'Texto de preenchimento sob medida', path: '/utils/lorem' },
      { title: 'Codificador Base64', shortTitle: 'Base64', description: 'Codifica e decodifica textos e arquivos', path: '/utils/base64' },
      { title: 'Conversor de Case', shortTitle: 'Conversor de Case', description: 'MAIÚSCULAS, Título, camelCase, snake_case...', path: '/utils/case' },
      { title: 'Conversor de Cores', shortTitle: 'Conversor de Cores', description: 'HEX, RGB, HSL, HSV, CMYK e contraste', path: '/utils/cores' },
      { title: 'Testador de RegEx', shortTitle: 'RegEx', description: 'Ocorrências, grupos e substituição ao vivo', path: '/utils/regex' },
      { title: 'Gerador de Hash', shortTitle: 'Hash', description: 'MD5, SHA-1 e SHA-256 de textos e arquivos', path: '/utils/hash' },
      { title: 'Diferença entre Datas', shortTitle: 'Datas', description: 'Intervalos, dias úteis e soma de períodos', path: '/utils/datas' },
      { title: 'Cronômetro e Timer', shortTitle: 'Cronômetro', description: 'Voltas e contagem regressiva com alarme', path: '/utils/cronometro' },
      { title: 'Conversor de Unidades', shortTitle: 'Unidades', description: 'Peso, medida, temperatura, dados e mais', path: '/utils/unidades' },
      { title: 'Extrator de Texto (OCR)', shortTitle: 'OCR', description: 'Lê o texto de imagens e prints', path: '/utils/ocr' },
    ],
  },
  {
    category: 'aleatorios',
    label: 'Aleatórios',
    singular: 'Aleatório',
    tools: [
      { title: 'Placar', shortTitle: 'Placar', description: 'Contador de pontos por lado, com tela cheia', path: '/aleatorios/placar' },
    ],
  },
];

export const toolCount = toolSections.reduce((total, section) => total + section.tools.length, 0);
