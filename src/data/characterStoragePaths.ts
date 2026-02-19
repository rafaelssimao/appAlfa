import {
  documentDirectory,
  makeDirectoryAsync,
  copyAsync,
} from 'expo-file-system/legacy';

const CHARACTERS_DIR = 'characters';

export function getCharacterDirUri(characterId: string): string {
  const base = documentDirectory ?? '';
  return `${base}${CHARACTERS_DIR}/${characterId}`;
}

export function getCharacterPhotoPath(characterId: string): string {
  return `${getCharacterDirUri(characterId)}/photo.jpg`;
}

/** Caminho único para nova foto (evita cache do Image ao trocar a imagem). */
export function getCharacterPhotoPathWithTimestamp(characterId: string): string {
  return `${getCharacterDirUri(characterId)}/photo_${Date.now()}.jpg`;
}

export function getCharacterLetterSoundPath(characterId: string, letterId: string): string {
  return `${getCharacterDirUri(characterId)}/${letterId.toUpperCase()}.m4a`;
}

export async function ensureCharacterDir(characterId: string): Promise<string> {
  const dir = getCharacterDirUri(characterId);
  const { getInfoAsync } = await import('expo-file-system/legacy');
  const parent = dir.slice(0, dir.lastIndexOf('/'));
  const parentInfo = await getInfoAsync(parent).catch(() => ({ exists: false }));
  if (!parentInfo.exists && parent.length > 0) {
    await makeDirectoryAsync(parent, { intermediates: true });
  }
  await makeDirectoryAsync(dir, { intermediates: true });
  return dir;
}
