const arrayToCSV = (data) => {
  let csv = data.map((row) => Object.values(row));
  csv.unshift(Object.keys(data[0]));
  return `"${csv.join('"\n"').replace(/,/g, '","')}"`;
};
export { arrayToCSV };
