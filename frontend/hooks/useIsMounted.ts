import { useEffect, useState } from 'react'

/**
 * Hook para evitar problemas de hidratación en componentes client-side
 * Útil cuando se usan hooks de wagmi que dependen del cliente
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
