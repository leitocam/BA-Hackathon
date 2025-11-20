'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface SongDetail {
  entityKey: string
  songTitle: string
  artist: string
  genre: string
  nftContractAddress: string
  collaborators: Array<{
    name: string
    role: string
    percentage: number
    walletAddress: string
    crossmintEmail?: string
    useCrossmint?: boolean
  }>
  createdAt?: string
}

export default function SongDetailPage() {
  const params = useParams()
  const { isConnected } = useAccount()
  const [song, setSong] = useState<SongDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [fundAmount, setFundAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && params.id) {
      loadSong()
    }
  }, [mounted, params.id])

  const loadSong = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/songs?entityKey=${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setSong(result.data)
      } else {
        alert('Canción no encontrada')
      }
    } catch (error) {
      console.error('Error cargando canción:', error)
      alert('Error al cargar la canción')
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      alert('Ingresá un monto válido')
      return
    }

    setIsDepositing(true)
    try {
      // TODO: Integrar con contrato
      console.log('Depositing:', fundAmount, 'ETH')
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`${fundAmount} ETH enviados exitosamente!`)
      setFundAmount('')
    } catch (error) {
      console.error('Error depositing:', error)
      alert('Error al enviar fondos')
    } finally {
      setIsDepositing(false)
    }
  }

  const handleDistribute = async () => {
    setIsDistributing(true)
    try {
      // TODO: Integrar con contrato distribute()
      console.log('Distributing funds')
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Fondos distribuidos exitosamente!')
    } catch (error) {
      console.error('Error distributing:', error)
      alert('Error al distribuir fondos')
    } finally {
      setIsDistributing(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <p className="text-[18px] mb-4" style={{ color: '#C2CAD7' }}>
            Conectá tu wallet para ver esta canción
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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mb-4" style={{ borderColor: '#FC3C44' }}></div>
          <p className="text-[16px]" style={{ color: '#8E8E93' }}>Cargando canción...</p>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <p className="text-[18px] mb-4" style={{ color: '#C2CAD7' }}>
            Canción no encontrada
          </p>
          <Link href="/songs">
            <button 
              className="h-[52px] px-8 rounded-full text-[15px] font-semibold"
              style={{
                background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                color: '#FFFFFF',
              }}
            >
              Volver a canciones
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12" style={{ background: '#000000' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/songs" className="inline-flex items-center gap-2 text-[14px] mb-4" style={{ color: '#8E8E93' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a canciones
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Album Art */}
            <div 
              className="w-full lg:w-64 aspect-square rounded-[24px] flex-shrink-0 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                boxShadow: '0 12px 32px -8px rgba(252, 60, 68, 0.5)',
              }}
            >
              <svg className="w-24 h-24" fill="rgba(255, 255, 255, 0.9)" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-[40px] font-bold mb-3" style={{ color: '#FFFFFF' }}>
                {song.songTitle}
              </h1>
              
              <p className="text-[18px] mb-4" style={{ color: '#C2CAD7' }}>
                {song.artist}
              </p>

              <span 
                className="inline-block text-[12px] px-3 py-1 rounded-[6px] mb-6"
                style={{ 
                  background: 'rgba(52, 199, 89, 0.15)',
                  color: '#34C759'
                }}
              >
                {song.genre}
              </span>

              <div 
                className="px-4 py-3 rounded-[12px] text-[13px] font-mono mb-6"
                style={{
                  background: 'rgba(28, 28, 30, 0.8)',
                  color: '#C2CAD7',
                }}
              >
                <span style={{ color: '#8E8E93' }}>NFT:</span> {song.nftContractAddress}
              </div>

              <div className="flex gap-4">
                <a
                  href={`https://sepolia.scrollscan.com/address/${song.nftContractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="px-6 py-4 rounded-[16px] border transition-all"
                  style={{
                    background: 'rgba(28, 28, 30, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(44, 44, 46, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(28, 28, 30, 0.8)';
                  }}
                >
                  <p className="text-[13px] mb-1" style={{ color: '#8E8E93' }}>
                    Ver en Scroll Sepolia
                  </p>
                  <p className="text-[14px] font-semibold" style={{ color: '#FC3C44' }}>
                    Block Explorer →
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Colaboradores */}
            <div 
              className="rounded-[24px] p-8 border"
              style={{
                background: 'rgba(28, 28, 30, 0.8)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 className="text-[24px] font-bold mb-6" style={{ color: '#FFFFFF' }}>
                Colaboradores ({song.collaborators.length})
              </h2>

              <div className="space-y-3">
                {song.collaborators.map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-[14px] border"
                    style={{
                      background: 'rgba(44, 44, 46, 0.6)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[15px] font-semibold" style={{ color: '#FFFFFF' }}>
                          {contributor.name}
                        </p>
                        <span 
                          className="text-[11px] px-2 py-0.5 rounded"
                          style={{ 
                            background: 'rgba(252, 60, 68, 0.15)',
                            color: '#FC3C44'
                          }}
                        >
                          {contributor.role}
                        </span>
                        {contributor.useCrossmint && (
                          <span 
                            className="text-[11px] px-2 py-0.5 rounded"
                            style={{ 
                              background: 'rgba(52, 199, 89, 0.15)',
                              color: '#34C759'
                            }}
                          >
                            💳 Crossmint
                          </span>
                        )}
                      </div>
                      {contributor.useCrossmint && contributor.crossmintEmail ? (
                        <div className="space-y-1">
                          <p className="text-[12px]" style={{ color: '#8E8E93' }}>
                            📧 {contributor.crossmintEmail}
                          </p>
                          <p className="text-[11px] font-mono" style={{ color: '#636366' }}>
                            Wallet: {contributor.walletAddress.slice(0, 10)}...{contributor.walletAddress.slice(-8)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[13px] font-mono" style={{ color: '#8E8E93' }}>
                          {contributor.walletAddress.slice(0, 10)}...{contributor.walletAddress.slice(-8)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[20px] font-bold" style={{ color: '#FC3C44' }}>
                          {contributor.percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Ingresos */}
          <div className="space-y-6">
            {/* Info */}
            <div 
              className="rounded-[24px] p-6 border"
              style={{
                background: 'rgba(28, 28, 30, 0.8)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="text-[18px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
                📊 Información
              </h3>
              
              <div className="space-y-3 text-[14px]">
                <div>
                  <p style={{ color: '#8E8E93' }}>Colaboradores</p>
                  <p style={{ color: '#FFFFFF' }} className="font-semibold">{song.collaborators.length}</p>
                </div>
                <div>
                  <p style={{ color: '#8E8E93' }}>Género</p>
                  <p style={{ color: '#FFFFFF' }} className="font-semibold">{song.genre}</p>
                </div>
                {song.createdAt && (
                  <div>
                    <p style={{ color: '#8E8E93' }}>Creada</p>
                    <p style={{ color: '#FFFFFF' }} className="font-semibold">
                      {new Date(song.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enviar fondos - Disabled por ahora */}
            <div 
              className="rounded-[24px] p-6 border"
              style={{
                background: 'rgba(28, 28, 30, 0.5)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="text-[20px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
                🚧 Próximamente
              </h3>

              <p className="text-[14px] mb-4" style={{ color: '#8E8E93' }}>
                Funciones en desarrollo:
              </p>

              <ul className="space-y-2 text-[14px]" style={{ color: '#C2CAD7' }}>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#FC3C44' }}>•</span>
                  Enviar fondos al splitter
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#FC3C44' }}>•</span>
                  Distribuir ingresos
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#FC3C44' }}>•</span>
                  Ver historial de transacciones
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#FC3C44' }}>•</span>
                  Balance en tiempo real
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
