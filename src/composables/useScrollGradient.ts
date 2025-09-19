import { ref } from 'vue'

export const useScrollGradient = () => {
  const scrollProgress = ref(0)

  const updateScrollProgress = (element: HTMLElement) => {
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    
    if (scrollHeight > 0) {
      scrollProgress.value = Math.min(scrollTop / scrollHeight, 1)
    } else {
      scrollProgress.value = 0
    }
  }

  const getGradientStyle = (scrollProgress: number) => {
    // Calcul des couleurs en fonction de la progression du scroll
    // Plus on scrolle vers le bas, plus les couleurs deviennent sombres
    
    const lightBrown = { r: 160, g: 82, b: 45 }   // rgba(160, 82, 45, 0.9)
    const mediumBrown = { r: 139, g: 69, b: 19 }  // rgba(139, 69, 19, 0.95)
    const darkBrown = { r: 101, g: 67, b: 33 }    // rgba(101, 67, 33, 0.95)
    const veryDarkBrown = { r: 62, g: 39, b: 35 } // rgba(62, 39, 35, 0.98)

    // Interpolation en fonction de la progression
    const progress = Math.max(0, Math.min(1, scrollProgress))
    
    // Calcul des couleurs interpolées
    let topColor, bottomColor
    
    if (progress < 0.33) {
      // Transition de lightBrown à mediumBrown
      const factor = progress / 0.33
      topColor = {
        r: Math.round(lightBrown.r + (mediumBrown.r - lightBrown.r) * factor),
        g: Math.round(lightBrown.g + (mediumBrown.g - lightBrown.g) * factor),
        b: Math.round(lightBrown.b + (mediumBrown.b - lightBrown.b) * factor)
      }
      bottomColor = {
        r: Math.round(mediumBrown.r + (darkBrown.r - mediumBrown.r) * factor),
        g: Math.round(mediumBrown.g + (darkBrown.g - mediumBrown.g) * factor),
        b: Math.round(mediumBrown.b + (darkBrown.b - mediumBrown.b) * factor)
      }
    } else if (progress < 0.66) {
      // Transition de mediumBrown à darkBrown
      const factor = (progress - 0.33) / 0.33
      topColor = {
        r: Math.round(mediumBrown.r + (darkBrown.r - mediumBrown.r) * factor),
        g: Math.round(mediumBrown.g + (darkBrown.g - mediumBrown.g) * factor),
        b: Math.round(mediumBrown.b + (darkBrown.b - mediumBrown.b) * factor)
      }
      bottomColor = {
        r: Math.round(darkBrown.r + (veryDarkBrown.r - darkBrown.r) * factor),
        g: Math.round(darkBrown.g + (veryDarkBrown.g - darkBrown.g) * factor),
        b: Math.round(darkBrown.b + (veryDarkBrown.b - darkBrown.b) * factor)
      }
    } else {
      // Transition de darkBrown à veryDarkBrown
      const factor = (progress - 0.66) / 0.34
      topColor = {
        r: Math.round(darkBrown.r + (veryDarkBrown.r - darkBrown.r) * factor),
        g: Math.round(darkBrown.g + (veryDarkBrown.g - darkBrown.g) * factor),
        b: Math.round(darkBrown.b + (veryDarkBrown.b - darkBrown.b) * factor)
      }
      bottomColor = {
        r: Math.max(35, Math.round(veryDarkBrown.r - 20 * factor)),
        g: Math.max(25, Math.round(veryDarkBrown.g - 15 * factor)),
        b: Math.max(20, Math.round(veryDarkBrown.b - 10 * factor))
      }
    }

    return `
      linear-gradient(180deg, 
        rgba(${topColor.r}, ${topColor.g}, ${topColor.b}, 0.9) 0%,
        rgba(${Math.round((topColor.r + bottomColor.r) / 2)}, ${Math.round((topColor.g + bottomColor.g) / 2)}, ${Math.round((topColor.b + bottomColor.b) / 2)}, 0.95) 50%,
        rgba(${bottomColor.r}, ${bottomColor.g}, ${bottomColor.b}, 0.98) 100%),
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)
    `
  }

  return {
    scrollProgress,
    updateScrollProgress,
    getGradientStyle
  }
}
