import { useState, useCallback } from 'react'

interface ToastState {
  show: boolean
  message: string
  variant: 'success' | 'error' | 'info' | 'warning'
}

/**
 * Hook para manejar notificaciones tipo toast
 * Útil para mostrar feedback de transacciones
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    variant: 'info'
  })

  const showToast = useCallback((message: string, variant: ToastState['variant'] = 'info') => {
    setToast({ show: true, message, variant })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 5000)
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }))
  }, [])

  return { toast, showToast, hideToast }
}
