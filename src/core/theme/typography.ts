/**
 * Tipografia lúdica e legível para alfabetização
 */
export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  letterBig: {
    fontSize: 72,
    fontWeight: '800' as const,
  },
  letterTile: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  animalName: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
} as const;
