/**
 * Paleta de cores no estilo Tralalelu/Tralala - alegre e envolvente para crianças
 */
export const colors = {
  background: '#FFF8E7',      // Amarelo creme suave
  surface: '#FFFFFF',
  primary: '#FF6B9D',        // Rosa divertido
  primaryDark: '#E84A7A',
  secondary: '#7B68EE',      // Roxo mágico
  accent: '#FFD93D',         // Amarelo sol
  success: '#6BCB77',        // Verde natureza
  letterTile: '#FFFFFF',
  letterTileBorder: '#FFB6C1',
  text: '#2D3436',
  textLight: '#636E72',
  overlay: 'rgba(0,0,0,0.4)',
  // Cores extras para variedade
  orange: '#FF9F43',
  blue: '#54A0FF',
  mint: '#00D2D3',
} as const;

export type Colors = typeof colors;
