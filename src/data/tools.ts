export type ToolCategory = 'utils' | 'geradores' | 'validadores';

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
    category: 'utils',
    label: 'Utilitários',
    singular: 'Utilitário',
    tools: [
      { title: 'Formatar Texto', shortTitle: 'Formatar Texto', description: 'Conta, limpa e sanitiza textos', path: '/utils/caracteres' },
      { title: 'Indentador de Arquivo', shortTitle: 'Indentador', description: 'Indenta JSON, XML, HTML, CSS e JS', path: '/utils/indentador' },
      { title: 'Gerador Lorem Ipsum', shortTitle: 'Lorem Ipsum', description: 'Texto de preenchimento sob medida', path: '/utils/lorem' },
      { title: 'Codificador Base64', shortTitle: 'Base64', description: 'Codifica e decodifica textos e arquivos', path: '/utils/base64' },
    ],
  },
  {
    category: 'geradores',
    label: 'Geradores',
    singular: 'Gerador',
    tools: [
      { title: 'Gerar CPF/CNPJ', shortTitle: 'CPF/CNPJ', description: 'Documentos válidos para testes', path: '/geradores/cpf-cnpj' },
      { title: 'Gerar CEP', shortTitle: 'CEP', description: 'CEPs reais com endereço', path: '/geradores/cep' },
    ],
  },
  {
    category: 'validadores',
    label: 'Validadores',
    singular: 'Validador',
    tools: [
      { title: 'Validar CPF/CNPJ', shortTitle: 'CPF/CNPJ', description: 'Confere os dígitos verificadores', path: '/validadores/cpf-cnpj' },
      { title: 'Validar CEP', shortTitle: 'CEP', description: 'Consulta o endereço no ViaCEP', path: '/validadores/cep' },
    ],
  },
];

export const toolCount = toolSections.reduce((total, section) => total + section.tools.length, 0);
