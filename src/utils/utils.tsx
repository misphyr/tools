// utils/dateGenerator.ts

const dateGenerator = (start: Date = new Date('2000/01/01'), end: Date = new Date('2030/01/01')): Date => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  return randomDate;
};

const stringGenerator = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const charGenerator = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars[Math.floor(Math.random() * chars.length)];
};

const nameGenerator = () => {
  const palavras: string[] = [
    "Abacate", "Banana", "Caju", "Damasco", "Embaúba", "Figo", "Goiaba", "Hortelã", "Inhame", "Jabuticaba",
    "Kiwi", "Limão", "Manga", "Nectarina", "Oliveira", "Pitanga", "Queijo", "Romã", "Sapoti", "Tangerina",
    "Uva", "Vergamota", "Wasabi", "Xícara", "Zebrafish", "Amora", "Buriti", "Cacau", "Dendê", "Escarola",
    "Framboesa", "Gengibre", "Hibisco", "Inhambu", "Jaca", "Kiabo", "Laranja", "Melancia", "Nabo", "Orégano",
    "Pêssego", "Quinoa", "Rabanete", "Salsa", "Tomate", "Uvaia", "Vagem", "Xerém", "Zimbro"
  ];
  return `${palavras[Math.floor(Math.random() * palavras.length)]} ${palavras[Math.floor(Math.random() * palavras.length)]}`;
};

const numberStringGenerator = (min: number = 1, max: number = 10000): string => {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

const numberGenerator = (min: number = 1, max: number = 10000):number => {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
}

function* incrementLastNumber() {
  let cdaNum: number = 1;
  while (true) {
    yield cdaNum++;
  }
};

const cdaNumGenarator = incrementLastNumber();

const cpfGenerator = (formatted: boolean) => {
  const random = () => Math.floor(Math.random() * 10);
  let cpf = Array.from({ length: 9 }, random).join('');
  cpf += calculateCPFCheckDigits(cpf);
  return formatted
    ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    : cpf;
};

const calculateCPFCheckDigits = (base: string) => {
  let sum = 0;
  let weight = 10;
  for (let i = 0; i < base.length; i++) {
    sum += parseInt(base[i]) * weight--;
  }
  const firstDigit = (sum % 11) < 2 ? 0 : 11 - (sum % 11);
  sum = 0;
  weight = 11;
  base += firstDigit;
  for (let i = 0; i < base.length; i++) {
    sum += parseInt(base[i]) * weight--;
  }
  const secondDigit = (sum % 11) < 2 ? 0 : 11 - (sum % 11);

  return `${firstDigit}${secondDigit}`;
};

const cnpjGenerator = (formatted: boolean) => {
  const random = () => Math.floor(Math.random() * 10);
  let cnpj = Array.from({ length: 12 }, random).join('');
  cnpj += calculateCNPJCheckDigits(cnpj);
  return formatted
    ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    : cnpj;
};

const calculateCNPJCheckDigits = (base: string) => {
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const calculateDigit = (base: string, weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const firstDigit = calculateDigit(base, weights1);
  const secondDigit = calculateDigit(base + firstDigit, weights2);
  return `${firstDigit}${secondDigit}`;
};

export { dateGenerator, stringGenerator, numberStringGenerator, numberGenerator, cdaNumGenarator, charGenerator, nameGenerator, cpfGenerator, cnpjGenerator }