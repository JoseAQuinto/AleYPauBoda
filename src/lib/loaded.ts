/**
 * Recuerda qué versión de cada foto ya ha descargado el navegador (currentSrc),
 * para que el visor la muestre al instante mientras llega la versión grande.
 */
const loaded = new Map<number, { src: string; width: number }>()

export function rememberLoaded(index: number, img: HTMLImageElement) {
  img.dataset.loaded = ''
  if (!img.currentSrc) return
  const prev = loaded.get(index)
  // Nos quedamos con la más grande que se haya cargado.
  if (!prev || img.naturalWidth >= prev.width) {
    loaded.set(index, { src: img.currentSrc, width: img.naturalWidth })
  }
}

export function loadedSrc(index: number) {
  return loaded.get(index)?.src
}
