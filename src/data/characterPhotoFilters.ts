/**
 * Filtros de imagem disponíveis no cadastro do personagem.
 * Cada filtro pode ser mapeado para parâmetros de pós-processamento (ex.: matriz de cores).
 */
export const PHOTO_FILTER_IDS = [
  'cartoon_2d',
  'caricatura',
  'pixar_3d',
  'anime',
  'hq_comics',
  'sketch',
] as const;

export type PhotoFilterId = (typeof PHOTO_FILTER_IDS)[number];

export interface PhotoFilterOption {
  id: PhotoFilterId;
  label: string;
}

export const PHOTO_FILTER_OPTIONS: PhotoFilterOption[] = [
  { id: 'cartoon_2d', label: 'Cartoon 2D' },
  { id: 'caricatura', label: 'Caricatura Exagerada' },
  { id: 'pixar_3d', label: 'Pixar 3D' },
  { id: 'anime', label: 'Anime' },
  { id: 'hq_comics', label: 'HQ / Comics' },
  { id: 'sketch', label: 'Sketch' },
];

/** Valor que indica "sem filtro" (salvar foto original). */
export const NO_FILTER_ID = 'none' as const;
export type PhotoFilterIdOrNone = PhotoFilterId | typeof NO_FILTER_ID;

/**
 * Matriz de cores 5x4 (20 números) para o Skia ColorMatrix.
 * Ver: https://fecolormatrix.com/
 */
export function getColorMatrixForFilter(filterId: PhotoFilterId): number[] {
  switch (filterId) {
    case 'cartoon_2d':
      // Saturação alta, leve contraste
      return [1.2, 0.15, 0.05, 0, 10, 0.1, 1.15, 0.1, 0, 10, 0.05, 0.1, 1.2, 0, 10, 0, 0, 0, 1, 0];
    case 'caricatura':
      // Contraste e saturação altos
      return [1.4, 0.1, 0, 0, -20, 0.1, 1.35, 0.05, 0, -20, 0, 0.05, 1.4, 0, -20, 0, 0, 0, 1, 0];
    case 'pixar_3d':
      // Cores suaves, brilho leve
      return [1.1, 0.05, 0, 0, 8, 0.05, 1.08, 0.05, 0, 8, 0, 0.05, 1.1, 0, 8, 0, 0, 0, 1, 0];
    case 'anime':
      // Saturação e contraste (estilo anime)
      return [1.35, 0.2, 0, 0, -5, 0.15, 1.3, 0.1, 0, -5, 0.05, 0.15, 1.35, 0, -5, 0, 0, 0, 1, 0];
    case 'hq_comics':
      // HQ: contraste forte, cores marcantes
      return [1.45, 0.1, 0, 0, -25, 0.08, 1.4, 0.08, 0, -25, 0, 0.08, 1.45, 0, -25, 0, 0, 0, 1, 0];
    case 'sketch':
      // Grayscale + contraste (desenho)
      return [0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0, 0, 0, 1, 0];
    default:
      return [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
  }
}
