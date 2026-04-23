/**
 * Génère une URL Unsplash optimisée selon la largeur souhaitée.
 * Utilisation : unsplash('photo-id', 900)
 * Pour les images en hero full-width : 1400 desktop / 800 mobile
 */
export function unsplash(photoId, width = 900, quality = 80) {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=${quality}&fit=crop&auto=format`
}

/**
 * Retourne un srcSet Unsplash responsive pour <img>.
 * Utilisation dans style : backgroundImage ne supporte pas srcset,
 * donc cette fonction sert pour les <img> tags futurs.
 */
export function unsplashSrcSet(photoId) {
  return [400, 800, 1200, 1600]
    .map(w => `https://images.unsplash.com/photo-${photoId}?w=${w}&q=80&fit=crop&auto=format ${w}w`)
    .join(', ')
}
