/**
 * Paleta estilo Sonic - cores claras, vibrantes e legíveis para crianças (5 anos)
 */
export const colors = {
  background: '#E3F2FD',       // Azul céu claro
  surface: '#FFFFFF',
  primary: '#0088FF',          // Azul Sonic
  primaryDark: '#0066CC',
  secondary: '#E53935',        // Vermelho (sapato Sonic)
  accent: '#FFD700',            // Dourado (anéis)
  success: '#43A047',          // Verde (Green Hill)
  letterTile: '#FFFFFF',
  letterTileBorder: '#0088FF',
  text: '#1565C0',             // Azul escuro legível
  textLight: '#42A5F5',
  overlay: 'rgba(0,0,0,0.35)',
  orange: '#FF9800',
  blue: '#0088FF',
  mint: '#26A69A',
} as const;

export type Colors = typeof colors;
