// Découpe un fichier SQL en instructions (le pilote HTTP Neon n'en accepte qu'une par requête).
// Ignore les « ; » dans les commentaires, les chaînes '...' et les blocs $$...$$.
export function decouperSql(texte) {
  const instructions = [];
  let courant = "";
  let i = 0;
  while (i < texte.length) {
    const c = texte[i];
    if (c === "-" && texte[i + 1] === "-") {
      const fin = texte.indexOf("\n", i);
      i = fin === -1 ? texte.length : fin;
      continue;
    }
    if (c === "'" || (c === "$" && texte[i + 1] === "$")) {
      const delim = c === "'" ? "'" : "$$";
      let j = i + delim.length;
      while (j < texte.length) {
        if (texte.startsWith(delim, j)) {
          // '' à l'intérieur d'une chaîne est une apostrophe échappée
          if (delim === "'" && texte[j + 1] === "'") {
            j += 2;
            continue;
          }
          break;
        }
        j++;
      }
      courant += texte.slice(i, j + delim.length);
      i = j + delim.length;
      continue;
    }
    if (c === ";") {
      if (courant.trim()) instructions.push(courant.trim());
      courant = "";
      i++;
      continue;
    }
    courant += c;
    i++;
  }
  if (courant.trim()) instructions.push(courant.trim());
  return instructions;
}
