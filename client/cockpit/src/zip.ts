// Archive ZIP minimale, sans compression (les PDF et images le sont déjà) : de quoi regrouper quelques fichiers
// dans le navigateur sans dépendance supplémentaire.

const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(octets: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < octets.length; i++) c = TABLE[(c ^ octets[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Date et heure au format MS-DOS. */
function dateDos(d: Date) {
  return {
    heure: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    jour: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

export function creerZip(fichiers: { nom: string; octets: Uint8Array }[]): Blob {
  const encodeur = new TextEncoder();
  const { heure, jour } = dateDos(new Date());
  const locaux: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let decalage = 0;

  for (const f of fichiers) {
    const nom = encodeur.encode(f.nom);
    const crc = crc32(f.octets);
    const taille = f.octets.length;

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // noms en UTF-8
    local.setUint16(8, 0, true); // stocké, sans compression
    local.setUint16(10, heure, true);
    local.setUint16(12, jour, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, taille, true);
    local.setUint32(22, taille, true);
    local.setUint16(26, nom.length, true);
    locaux.push(new Uint8Array(local.buffer), nom, f.octets);

    const entree = new DataView(new ArrayBuffer(46));
    entree.setUint32(0, 0x02014b50, true);
    entree.setUint16(4, 20, true);
    entree.setUint16(6, 20, true);
    entree.setUint16(8, 0x0800, true);
    entree.setUint16(10, 0, true);
    entree.setUint16(12, heure, true);
    entree.setUint16(14, jour, true);
    entree.setUint32(16, crc, true);
    entree.setUint32(20, taille, true);
    entree.setUint32(24, taille, true);
    entree.setUint16(28, nom.length, true);
    entree.setUint32(42, decalage, true);
    central.push(new Uint8Array(entree.buffer), nom);

    decalage += 30 + nom.length + taille;
  }

  const tailleCentral = central.reduce((s, b) => s + b.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(8, fichiers.length, true);
  fin.setUint16(10, fichiers.length, true);
  fin.setUint32(12, tailleCentral, true);
  fin.setUint32(16, decalage, true);
  return new Blob([...locaux, ...central, new Uint8Array(fin.buffer)] as BlobPart[], { type: "application/zip" });
}
