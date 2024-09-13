// utils/downloadJson.ts
export const downloadJson = (data: object, filename: string) => {
  filename ?? "undefined.json";
  console.log("data", data);
  const json = JSON.stringify(data, null, 2);
  console.log("json", json);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
