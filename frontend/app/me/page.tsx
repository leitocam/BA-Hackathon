'use client'

import { useAccount } from 'wagmi'
import Link from 'next/link'

// Mock data - TODO: Reemplazar con datos reales del contrato
const MOCK_EARNINGS = {
  totalEarned: '2.45',
  pendingClaim: '0.35',
  songs: [
    {
      id: '1',
      title: 'Summer Vibes',
      percentage: 40,
      earned: '1.2',
      splitterAddress: '0x1234...5678'
    },
    {
      id: '2', 
      title: 'Night Drive',
      percentage: 25,
      earned: '0.85',
      splitterAddress: '0xabcd...ef12'
    },
    {
      id: '3',
      title: 'Urban Beats',
      percentage: 15,
      earned: '0.40',
      splitterAddress: '0x9876...4321'
    }
  ]
}

export default function CollaboratorPage() {
  const { isConnected, address } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <p className="text-[18px] mb-4" style={{ color: '#C2CAD7' }}>
            Conectá tu wallet para ver tus ganancias
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
          <h1 className="text-[36px] font-bold mb-2" style={{ color: '#FFFFFF' }}>
            Mis Ganancias
          </h1>
          <p className="text-[16px]" style={{ color: '#C2CAD7' }}>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total ganado"
            value={`${MOCK_EARNINGS.totalEarned} ETH`}
            icon="💰"
            highlight
          />
          <StatCard
            label="Por reclamar"
            value={`${MOCK_EARNINGS.pendingClaim} ETH`}
            icon="⏳"
          />
          <StatCard
            label="Canciones activas"
            value={MOCK_EARNINGS.songs.length.toString()}
            icon="🎵"
          />
        </div>

        {/* Songs List */}
        <div 
          className="rounded-[24px] p-8 border"
          style={{
            background: 'rgba(28, 28, 30, 0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2 className="text-[24px] font-bold mb-6" style={{ color: '#FFFFFF' }}>
            Mis Colaboraciones
          </h2>

          <div className="space-y-4">
            {MOCK_EARNINGS.songs.map((song) => (
              <div
                key={song.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-[16px] border transition-all"
                style={{
                  background: 'rgba(44, 44, 46, 0.6)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(58, 58, 60, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(44, 44, 46, 0.6)';
                }}
              >
                <div className="flex-1 mb-4 sm:mb-0">
                  <h3 className="text-[18px] font-semibold mb-1" style={{ color: '#FFFFFF' }}>
                    {song.title}
                  </h3>
                  <p className="text-[14px]" style={{ color: '#8E8E93' }}>
                    {song.splitterAddress}
                  </p>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="text-center">
                    <p className="text-[12px] mb-1" style={{ color: '#8E8E93' }}>
                      Mi Split
                    </p>
                    <p className="text-[18px] font-semibold" style={{ color: '#FC3C44' }}>
                      {song.percentage}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[12px] mb-1" style={{ color: '#8E8E93' }}>
                      Ganado
                    </p>
                    <p className="text-[18px] font-semibold" style={{ color: '#34C759' }}>
                      {song.earned} ETH
                    </p>
                  </div>

                  <Link href={`/songs/${song.id}`}>
                    <button
                      className="h-[40px] px-5 rounded-full text-[14px] font-medium transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 100%)',
                        color: '#FFFFFF',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      Ver detalle
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {MOCK_EARNINGS.songs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[16px] mb-4" style={{ color: '#8E8E93' }}>
                Todavía no participás en ninguna canción
              </p>
              <Link href="/songs/new">
                <button 
                  className="h-[48px] px-8 rounded-full text-[15px] font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                    color: '#FFFFFF',
                  }}
                >
                  Crear mi primera canción
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div 
          className="mt-6 p-6 rounded-[16px] border"
          style={{
            background: 'linear-gradient(135deg, rgba(252, 60, 68, 0.1) 0%, rgba(249, 76, 87, 0.05) 100%)',
            borderColor: 'rgba(252, 60, 68, 0.3)',
          }}
        >
          <h3 className="text-[16px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>
            💡 Así lo vería el beatmaker / diseñador
          </h3>
          <p className="text-[14px]" style={{ color: '#C2CAD7' }}>
            Esta vista muestra todas tus colaboraciones y ganancias acumuladas. Los splits se distribuyen automáticamente cuando alguien envía fondos al contrato.
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, highlight = false }: { label: string, value: string, icon: string, highlight?: boolean }) {
  return (
    <div 
      className="p-6 rounded-[20px] border"
      style={{
        background: highlight 
          ? 'linear-gradient(135deg, rgba(252, 60, 68, 0.15) 0%, rgba(249, 76, 87, 0.08) 100%)'
          : 'rgba(28, 28, 30, 0.8)',
        backdropFilter: 'blur(20px)',
        borderColor: highlight ? 'rgba(252, 60, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px]" style={{ color: '#C2CAD7' }}>
          {label}
        </span>
        <span className="text-[28px]">{icon}</span>
      </div>
      <p className="text-[28px] font-bold" style={{ color: highlight ? '#FC3C44' : '#FFFFFF' }}>
        {value}
      </p>
    </div>
  )
}
