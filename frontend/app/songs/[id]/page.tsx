'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock data - TODO: Reemplazar con datos reales del contrato
const MOCK_SONG = {
  id: '1',
  title: 'Summer Vibes',
  metadataUri: 'ipfs://QmXxxx1234567890abcdefghijklmnopqrstuvwxyz',
  splitterAddress: '0x1234567890123456789012345678901234567890',
  totalBalance: '3.5',
  totalDistributed: '10.2',
  contributors: [
    { 
      address: '0x1111111111111111111111111111111111111111',
      percentage: 40,
      earned: '4.08',
      name: 'Producer'
    },
    { 
      address: '0x2222222222222222222222222222222222222222',
      percentage: 30,
      earned: '3.06',
      name: 'Vocalist'
    },
    { 
      address: '0x3333333333333333333333333333333333333333',
      percentage: 30,
      earned: '3.06',
      name: 'Beat Maker'
    },
  ],
  events: [
    { type: 'distribute', amount: '2.5', date: '2025-11-18' },
    { type: 'deposit', amount: '5.0', date: '2025-11-15' },
    { type: 'mint', amount: '0', date: '2025-11-10' },
  ]
}

export default function SongDetailPage() {
  const params = useParams()
  const { isConnected } = useAccount()
  const [fundAmount, setFundAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      alert('Ingresá un monto válido')
      return
    }

    setIsDepositing(true)
    try {
      // TODO: Integrar con contrato
      console.log('Depositing:', fundAmount, 'ETH to', MOCK_SONG.splitterAddress)
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
      console.log('Distributing funds from', MOCK_SONG.splitterAddress)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Fondos distribuidos exitosamente!')
    } catch (error) {
      console.error('Error distributing:', error)
      alert('Error al distribuir fondos')
    } finally {
      setIsDistributing(false)
    }
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
                {MOCK_SONG.title}
              </h1>
              
              <a 
                href={MOCK_SONG.metadataUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] mb-6 px-4 py-2 rounded-[10px] transition-all"
                style={{
                  background: 'rgba(44, 44, 46, 0.8)',
                  color: '#FC3C44',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(58, 58, 60, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(44, 44, 46, 0.8)';
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Ver Metadata (Arkiv)
              </a>

              <div 
                className="px-4 py-3 rounded-[12px] text-[13px] font-mono mb-6"
                style={{
                  background: 'rgba(28, 28, 30, 0.8)',
                  color: '#C2CAD7',
                }}
              >
                <span style={{ color: '#8E8E93' }}>Splitter:</span> {MOCK_SONG.splitterAddress}
              </div>

              <div className="flex gap-4">
                <div 
                  className="px-6 py-4 rounded-[16px] border"
                  style={{
                    background: 'rgba(28, 28, 30, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <p className="text-[13px] mb-1" style={{ color: '#8E8E93' }}>
                    Balance actual
                  </p>
                  <p className="text-[24px] font-bold" style={{ color: '#FC3C44' }}>
                    {MOCK_SONG.totalBalance} ETH
                  </p>
                </div>

                <div 
                  className="px-6 py-4 rounded-[16px] border"
                  style={{
                    background: 'rgba(28, 28, 30, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <p className="text-[13px] mb-1" style={{ color: '#8E8E93' }}>
                    Total distribuido
                  </p>
                  <p className="text-[24px] font-bold" style={{ color: '#34C759' }}>
                    {MOCK_SONG.totalDistributed} ETH
                  </p>
                </div>
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
                Colaboradores ({MOCK_SONG.contributors.length})
              </h2>

              <div className="space-y-3">
                {MOCK_SONG.contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-[14px] border"
                    style={{
                      background: 'rgba(44, 44, 46, 0.6)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold mb-1" style={{ color: '#FFFFFF' }}>
                        {contributor.name}
                      </p>
                      <p className="text-[13px] font-mono" style={{ color: '#8E8E93' }}>
                        {contributor.address.slice(0, 10)}...{contributor.address.slice(-8)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[20px] font-bold" style={{ color: '#FC3C44' }}>
                          {contributor.percentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px]" style={{ color: '#8E8E93' }}>Ganado</p>
                        <p className="text-[16px] font-semibold" style={{ color: '#34C759' }}>
                          {contributor.earned} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial de eventos */}
            <div 
              className="rounded-[24px] p-8 border"
              style={{
                background: 'rgba(28, 28, 30, 0.8)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 className="text-[24px] font-bold mb-6" style={{ color: '#FFFFFF' }}>
                Historial
              </h2>

              <div className="space-y-3">
                {MOCK_SONG.events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-[14px] border"
                    style={{
                      background: 'rgba(44, 44, 46, 0.6)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: event.type === 'distribute' 
                          ? 'rgba(52, 199, 89, 0.2)' 
                          : event.type === 'deposit'
                          ? 'rgba(252, 60, 68, 0.2)'
                          : 'rgba(142, 142, 147, 0.2)',
                      }}
                    >
                      {event.type === 'distribute' && '💸'}
                      {event.type === 'deposit' && '💰'}
                      {event.type === 'mint' && '🎵'}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-medium" style={{ color: '#FFFFFF' }}>
                        {event.type === 'distribute' && 'Distribución'}
                        {event.type === 'deposit' && 'Depósito'}
                        {event.type === 'mint' && 'Minted'}
                      </p>
                      <p className="text-[13px]" style={{ color: '#8E8E93' }}>
                        {event.date}
                      </p>
                    </div>
                    {event.amount !== '0' && (
                      <p className="text-[16px] font-semibold" style={{ color: '#FC3C44' }}>
                        {event.amount} ETH
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Ingresos */}
          <div className="space-y-6">
            {/* Enviar fondos */}
            <div 
              className="rounded-[24px] p-6 border"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 60, 68, 0.1) 0%, rgba(249, 76, 87, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(252, 60, 68, 0.3)',
              }}
            >
              <h3 className="text-[20px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
                💰 Ingresos
              </h3>

              <form onSubmit={handleDeposit} className="mb-4">
                <label className="block text-[14px] font-medium mb-2" style={{ color: '#C2CAD7' }}>
                  Simular ingreso
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-[48px] px-4 rounded-[12px] border text-[16px] mb-3"
                  style={{
                    background: 'rgba(28, 28, 30, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                  }}
                />
                <button
                  type="submit"
                  disabled={isDepositing || !fundAmount}
                  className="w-full h-[48px] rounded-full text-[15px] font-semibold transition-all disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 100%)',
                    color: '#FFFFFF',
                  }}
                >
                  {isDepositing ? 'Enviando...' : 'Enviar fondos al splitter'}
                </button>
              </form>

              <button
                onClick={handleDistribute}
                disabled={isDistributing}
                className="w-full h-[48px] rounded-full text-[15px] font-semibold border transition-all disabled:opacity-40"
                style={{
                  background: 'rgba(52, 199, 89, 0.15)',
                  borderColor: 'rgba(52, 199, 89, 0.3)',
                  color: '#34C759',
                }}
              >
                {isDistributing ? 'Distribuyendo...' : '⚡ Distribuir ahora'}
              </button>

              <p className="text-[12px] mt-3" style={{ color: '#8E8E93' }}>
                Los fondos se dividen automáticamente según los porcentajes definidos
              </p>
            </div>

            {/* Info adicional */}
            <div 
              className="rounded-[20px] p-6 border"
              style={{
                background: 'rgba(28, 28, 30, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4 className="text-[15px] font-semibold mb-3" style={{ color: '#FFFFFF' }}>
                📊 Resumen
              </h4>
              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <span style={{ color: '#8E8E93' }}>Total splits:</span>
                  <span style={{ color: '#FFFFFF' }}>100%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#8E8E93' }}>Contribuyentes:</span>
                  <span style={{ color: '#FFFFFF' }}>{MOCK_SONG.contributors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#8E8E93' }}>Eventos:</span>
                  <span style={{ color: '#FFFFFF' }}>{MOCK_SONG.events.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
