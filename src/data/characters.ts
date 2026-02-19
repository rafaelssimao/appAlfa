/**
 * Personagens da família para seleção e narração (estilo Tralalelu)
 */
export const CHARACTERS = [
  { id: 'pai', name: 'Pai', emoji: '👨' },
  { id: 'mae', name: 'Mãe', emoji: '👩' },
  { id: 'vo', name: 'Vó', emoji: '👵' },
  { id: 'vo2', name: 'Vô', emoji: '👴' },
  { id: 'tio', name: 'Tio', emoji: '👨' },
  { id: 'tia', name: 'Tia', emoji: '👩' },
  { id: 'amigo', name: 'Amigo', emoji: '🧒' },
] as const;

export type Character = (typeof CHARACTERS)[number];
