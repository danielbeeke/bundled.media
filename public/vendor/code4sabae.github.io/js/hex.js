const hex = {};

hex.fromBin = (bin) => {
  const s = [];
  for (let i = 0; i < bin.length; i++) {
    const n = bin[i].toString(16);
    s.push(n.length === 1 ? "0" + n : n);
  }
  return s.join("");
};
hex.toBin = (s) => {
  const bin = new Uint8Array(s.length);
  let n = 0;
  let flg = false;
  let bk = 0;
  for (const b of s) {
    const c = b.charCodeAt(0);
    let a = -1;
    if (c >= 48 && c <= 57) {
      a = c - 48;
    } else if (c >= 97 && c <= 102) {
      a = c - 97 + 10;
    } else if (c >= 65 && c <= 70) {
      a = c - 65 + 10;
    }
    if (a >= 0) {
      if (!flg) {
        bk = a;
      } else {
        bin[n++] = (bk << 4) | a;
      }
      flg = !flg;
    }
  }
  const res = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    res[i] = bin[i];
  }
  return res;
};

/*
console.log("0".charCodeAt(0));
console.log("9".charCodeAt(0));
console.log("a".charCodeAt(0));
console.log("f".charCodeAt(0));
console.log("A".charCodeAt(0));
console.log("F".charCodeAt(0));
*/

export { hex };
