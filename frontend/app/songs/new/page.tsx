'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import Link from 'next/link'

interface Contributor {
  address: string
  percentage: number
}

export default function NewSongPage() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [title, setTitle] = useState('')
  const [metadataUri, setMetadataUri] = useState('')
  const [contributors, setContributors] = useState<Contributor[]>([
    { address: '', percentage: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular el total de porcentajes
  const totalPercentage = contributors.reduce((sum, c) => sum + Number(c.percentage || 0), 0)
  const isValidPercentage = totalPercentage === 100

  const addContributor = () => {
    setContributors([...contributors, { address: '', percentage: 0 }])
  }

  const removeContributor = (index: number) => {
    if (contributors.length > 1) {
      setContributors(contributors.filter((_, i) => i !== index))
    }
  }

  const updateContributor = (index: number, field: 'address' | 'percentage', value: string | number) => {
    const updated = [...contributors]
    updated[index] = { ...updated[index], [field]: value }
    setContributors(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidPercentage) {
      alert('La suma de porcentajes debe ser exactamente 100%')
      return
    }

    if (!title || !metadataUri) {
      alert('Por favor completa todos los campos')
      return
    }

    // Validar direcciones
    const invalidAddress = contributors.find(c => !c.address || !c.address.startsWith('0x'))
    if (invalidAddress) {
      alert('Todas las direcciones deben ser válidas (empezar con 0x)')
      return
    }

    setIsSubmitting(true)
    
    try {
      // TODO: Integrar con el contrato Factory
      console.log('Minting song:', { title, metadataUri, contributors })
      
      // Simular llamada al contrato
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirigir al detalle (mock)
      router.push('/songs')
    } catch (error) {
      console.error('Error minting song:', error)
      alert('Error al crear la canción')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <p className="text-[18px] mb-4" style={{ color: '#C2CAD7' }}>
            Conectá tu wallet para crear una canción
          </p>
          <Link href="/">
            <button 
              className="h-[52px] px-8 rounded-full text-[15px] font-semibold"
              style={{
                background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                color: '#FFFFFF',
              }}
            >
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12" style={{ background: '#000000' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[14px] mb-4" style={{ color: '#8E8E93' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
          <h1 className="text-[36px] font-bold mb-2" style={{ color: '#FFFFFF' }}>
            Crear nueva canción
          </h1>
          <p className="text-[16px]" style={{ color: '#C2CAD7' }}>
            Minteá tu canción y definí cómo se dividirán los ingresos
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div 
            className="rounded-[24px] p-8 border mb-6"
            style={{
              background: 'rgba(28, 28, 30, 0.8)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Título */}
            <div className="mb-6">
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#FFFFFF' }}>
                Título de la canción *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Mi Primera Canción"
                className="w-full h-[48px] px-4 rounded-[12px] border text-[15px] transition-all"
                style={{
                  background: 'rgba(44, 44, 46, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                required
              />
            </div>

            {/* Metadata URI */}
            <div className="mb-6">
              <label className="block text-[14px] font-medium mb-2" style={{ color: '#FFFFFF' }}>
                Metadata URI (Arkiv) *
              </label>
              <input
                type="text"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                placeholder="ipfs://... o https://..."
                className="w-full h-[48px] px-4 rounded-[12px] border text-[15px] transition-all"
                style={{
                  background: 'rgba(44, 44, 46, 0.8)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                required
              />
              <p className="text-[12px] mt-1" style={{ color: '#8E8E93' }}>
                URL donde está almacenada la metadata de tu canción
              </p>
            </div>

            {/* Contribuyentes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-[14px] font-medium" style={{ color: '#FFFFFF' }}>
                  Contribuyentes *
                </label>
                <div 
                  className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                  style={{
                    background: isValidPercentage 
                      ? 'rgba(52, 199, 89, 0.15)' 
                      : 'rgba(255, 59, 48, 0.15)',
                    color: isValidPercentage ? '#34C759' : '#FF3B30',
                  }}
                >
                  Total: {totalPercentage}%
                </div>
              </div>

              <div className="space-y-3">
                {contributors.map((contributor, index) => (
                  <div 
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 p-4 rounded-[12px] border"
                    style={{
                      background: 'rgba(44, 44, 46, 0.6)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={contributor.address}
                        onChange={(e) => updateContributor(index, 'address', e.target.value)}
                        placeholder="0x..."
                        className="w-full h-[44px] px-3 rounded-[10px] border text-[14px]"
                        style={{
                          background: 'rgba(58, 58, 60, 0.8)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                        }}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={contributor.percentage || ''}
                        onChange={(e) => updateContributor(index, 'percentage', Number(e.target.value))}
                        placeholder="%"
                        min="0"
                        max="100"
                        className="w-20 h-[44px] px-3 rounded-[10px] border text-[14px] text-center"
                        style={{
                          background: 'rgba(58, 58, 60, 0.8)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                        }}
                        required
                      />
                      {contributors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContributor(index)}
                          className="w-[44px] h-[44px] rounded-[10px] transition-all"
                          style={{
                            background: 'rgba(255, 59, 48, 0.1)',
                            color: '#FF3B30',
                          }}
                        >
                          <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addContributor}
                className="mt-3 w-full h-[44px] rounded-[12px] border text-[14px] font-medium transition-all"
                style={{
                  background: 'transparent',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#C2CAD7',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                + Agregar contribuyente
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValidPercentage || isSubmitting}
            className="w-full h-[56px] rounded-full text-[16px] font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isValidPercentage 
                ? 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)'
                : 'rgba(44, 44, 46, 0.8)',
              color: '#FFFFFF',
              boxShadow: isValidPercentage ? '0 8px 24px -6px rgba(252, 60, 68, 0.6)' : 'none',
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Minteando...
              </span>
            ) : (
              '🎵 Mintear canción + crear splitter'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
