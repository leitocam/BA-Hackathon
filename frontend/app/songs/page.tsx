'use client'

import { useAccount } from 'wagmi'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Song {
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
  }>
  createdAt?: string
}

export default function SongsListPage() {
  const { isConnected, address } = useAccount()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isConnected) {
      loadSongs()
    }
  }, [mounted, isConnected])

  const loadSongs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/songs/list')
      const result = await response.json()
      
      if (result.success) {
        setSongs(result.data || [])
      }
    } catch (error) {
      console.error('Error cargando canciones:', error)
    } finally {
      setLoading(false)
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
            Conectá tu wallet para ver tus canciones
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[36px] font-bold mb-2" style={{ color: '#FFFFFF' }}>
              Mis Canciones
            </h1>
            <p className="text-[16px]" style={{ color: '#C2CAD7' }}>
              {loading ? 'Cargando...' : `${songs.length} ${songs.length === 1 ? 'canción' : 'canciones'}`}
            </p>
          </div>

          <Link href="/songs/new">
            <button 
              className="h-[52px] px-8 rounded-full text-[15px] font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              + Nueva canción
            </button>
          </Link>
        </div>

        {/* Songs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#FC3C44' }}></div>
            <p className="mt-4 text-[16px]" style={{ color: '#8E8E93' }}>Cargando canciones...</p>
          </div>
        ) : songs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <Link key={song.entityKey} href={`/songs/${song.entityKey}`}>
                <div 
                  className="rounded-[24px] p-6 border transition-all cursor-pointer"
                  style={{
                    background: 'rgba(28, 28, 30, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.background = 'rgba(44, 44, 46, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(28, 28, 30, 0.8)';
                  }}
                >
                  {/* Album Cover Placeholder */}
                  <div 
                    className="w-full aspect-square rounded-[16px] mb-4 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                    }}
                  >
                    <svg className="w-16 h-16" fill="rgba(255, 255, 255, 0.9)" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>

                  <h3 className="text-[20px] font-bold mb-2" style={{ color: '#FFFFFF' }}>
                    {song.songTitle}
                  </h3>

                  <p className="text-[14px] mb-3" style={{ color: '#8E8E93' }}>
                    {song.artist}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px]" style={{ color: '#8E8E93' }}>
                      {song.collaborators.length} colaboradores
                    </span>
                    <span 
                      className="text-[12px] px-2 py-1 rounded-[6px]"
                      style={{ 
                        background: 'rgba(52, 199, 89, 0.15)',
                        color: '#34C759'
                      }}
                    >
                      {song.genre}
                    </span>
                  </div>

                  <div 
                    className="px-3 py-2 rounded-[10px] text-[12px] font-mono"
                    style={{
                      background: 'rgba(44, 44, 46, 0.8)',
                      color: '#C2CAD7',
                    }}
                  >
                    {song.nftContractAddress.slice(0, 10)}...{song.nftContractAddress.slice(-8)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div 
            className="rounded-[24px] p-12 border text-center"
            style={{
              background: 'rgba(28, 28, 30, 0.8)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-[18px] mb-6" style={{ color: '#8E8E93' }}>
              Todavía no creaste ninguna canción
            </p>
            <Link href="/songs/new">
              <button 
                className="h-[52px] px-8 rounded-full text-[15px] font-semibold"
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
    </div>
  )
}
