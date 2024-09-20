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

const numberStringGenerator = (min: number = 1, max: number = 10000): string => {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

function* incrementLastNumber() {
  let cdaNum: number = 1;
  while (true) {
    yield cdaNum++;
  }
};

const cdaNumGenarator = incrementLastNumber();

export { dateGenerator, stringGenerator, numberStringGenerator, cdaNumGenarator, charGenerator }