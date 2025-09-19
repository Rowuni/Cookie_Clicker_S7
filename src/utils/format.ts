// Fonctions utilitaires pour le formatage

/**
 * Formate un nombre avec des suffixes (K, M, B, T) et notation scientifique si nécessaire
 * Arrondi à 3 chiffres après la virgule pour l'affichage principal
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return (Math.round(num * 1000) / 1000).toString()
  if (num < 1000000) return (Math.round((num / 1000) * 1000) / 1000) + 'K'
  if (num < 1000000000) return (Math.round((num / 1000000) * 1000) / 1000) + 'M'
  if (num < 1000000000000) return (Math.round((num / 1000000000) * 1000) / 1000) + 'B'
  if (num < 99999000000000000) return (Math.round((num / 1000000000000) * 1000) / 1000) + 'T'
  
  // Au-delà de 99999T, utiliser la notation scientifique
  const scientificNum = num / 1000000000000 // Convertir en trillions
  return scientificNum.toExponential(3).replace('e+', 'e+') + 'T'
}

/**
 * Formate le temps en format lisible (seulement secondes entières)
 */
export const formatTime = (seconds: number): string => {
  const totalSeconds = Math.floor(seconds) // Arrondir aux secondes entières
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  }
  
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  
  if (minutes < 60) {
    return `${minutes}min ${remainingSeconds}s`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours < 24) {
    return `${hours}h ${remainingMinutes}min ${remainingSeconds}s`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  if (days < 30) {
    return `${days}j ${remainingHours}h ${remainingMinutes}min`
  }
  
  const months = Math.floor(days / 30)
  const remainingDays = days % 30
  
  if (months < 12) {
    return `${months}mois ${remainingDays}j ${remainingHours}h`
  }
  
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  return `${years}an ${remainingMonths}mois ${remainingDays}j`
}
