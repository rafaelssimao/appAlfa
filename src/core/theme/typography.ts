/**
 * Tipografia grande e legível para crianças - estilo desenho animado
 */
export const typography = {
  title: {
    fontSize: 30,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  letterBig: {
    fontSize: 80,
    fontWeight: '800' as const,
  },
  letterTile: {
    fontSize: 26,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  animalName: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  caption: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
} as const;
