function chunk(matrix, step) {
  const length = matrix.length;
  const ans = [];
  for (let i = 0; i < Math.floor(length / step); i++) {
    ans.push(matrix.slice(i * step, (i + 1) * step));
  }
  return ans;
}

export function log(str = "", matrix, step = 4) {
  if (str.length !== 0) console.log(str);
  console.table(chunk(matrix.elements, step));
}
