// utils/dateGenerator.ts
export const dateGenerator = (start: Date = new Date('2000-01-01'), end: Date = new Date('2030-01-01')): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
