export const useAnimations = () => {
  const { isReducedMotion } = useAnimationPreferences() 

  const slideUp = (delay = 0) => {
    if (isReducedMotion.value) return undefined
    
    return {
      initial: { y: 40, opacity: 0 },
      visibleOnce: { 
        y: 0, 
        opacity: 1, 
        transition: { 
          duration: 400, 
          delay, 
          ease: [0.33, 1, 0.68, 1] 
        } 
      }
    }
  }

  return { slideUp }
}