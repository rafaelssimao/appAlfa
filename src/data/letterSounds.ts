/**
 * Mapeamento estático dos sons das letras (require para Metro bundler).
 * Voz padrão: assets/sounds/letters/ (A.m4a ... Z.m4a).
 * Por personagem: usar mesma voz até existir pasta por id (pai/, mae/, etc.).
 */
export const LETTER_SOUNDS: Record<string, number> = {
  a: require('../../assets/sounds/letters/A.m4a'),
  b: require('../../assets/sounds/letters/B.m4a'),
  c: require('../../assets/sounds/letters/C.m4a'),
  d: require('../../assets/sounds/letters/D.m4a'),
  e: require('../../assets/sounds/letters/E.m4a'),
  f: require('../../assets/sounds/letters/F.m4a'),
  g: require('../../assets/sounds/letters/G.m4a'),
  h: require('../../assets/sounds/letters/H.m4a'),
  i: require('../../assets/sounds/letters/I.m4a'),
  j: require('../../assets/sounds/letters/J.m4a'),
  k: require('../../assets/sounds/letters/K.m4a'),
  l: require('../../assets/sounds/letters/L.m4a'),
  m: require('../../assets/sounds/letters/M.m4a'),
  n: require('../../assets/sounds/letters/N.m4a'),
  o: require('../../assets/sounds/letters/O.m4a'),
  p: require('../../assets/sounds/letters/P.m4a'),
  q: require('../../assets/sounds/letters/Q.m4a'),
  r: require('../../assets/sounds/letters/R.m4a'),
  s: require('../../assets/sounds/letters/S.m4a'),
  t: require('../../assets/sounds/letters/T.m4a'),
  u: require('../../assets/sounds/letters/U.m4a'),
  v: require('../../assets/sounds/letters/V.m4a'),
  w: require('../../assets/sounds/letters/W.m4a'),
  x: require('../../assets/sounds/letters/X.m4a'),
  y: require('../../assets/sounds/letters/Y.m4a'),
  z: require('../../assets/sounds/letters/Z.m4a'),
};

/** Retorna o som da letra para o personagem. Por enquanto todos usam a mesma voz. */
export function getLetterSoundForCharacter(
  _characterId: string,
  letterId: string
): number | undefined {
  return LETTER_SOUNDS[letterId];
}
