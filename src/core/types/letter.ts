/**
 * Entidade de domínio: Letra do alfabeto para o jogo
 */
export interface LetterItem {
  id: string;
  letter: string;
  animalName: string;
  emoji: string;
  /** Caminho do som (require ou URL). Opcional - se não houver, usa som padrão */
  soundUri?: number | string;
}
