'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TeamMember {
  id: string
  name: string
  role: string
  walletAddress: string
  percentage: number
}

const COMMON_ROLES = [
  { value: 'Vocalista', emoji: '🎤' },
  { value: 'Productor', emoji: '🎛️' },
  { value: 'Beat Maker', emoji: '🥁' },
  { value: 'Compositor', emoji: '✍️' },
  { value: 'Guitarrista', emoji: '🎸' },
  { value: 'Bajista', emoji: '🎸' },
  { value: 'Baterista', emoji: '🥁' },
  { value: 'DJ', emoji: '🎧' },
  { value: 'Ingeniero de Mezcla', emoji: '🎚️' },
  { value: 'Diseñador de Arte', emoji: '🎨' },
]

export default function CreateSongPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [title, setTitle] = useState('')
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: '1',
      name: '',
      role: '',
      walletAddress: '',
      percentage: 0,
    }
  ])
  const [isCreating, setIsCreating] = useState(false)
  const [currentStep, setCurrentStep] = useState<'info' | 'team'>('info')

  const totalPercentage = team.reduce((sum, member) => sum + (member.percentage || 0), 0)
  const isValid = totalPercentage === 100 && team.every(m => m.name && m.role && m.walletAddress && m.percentage > 0)

  const addTeamMember = () => {
    setTeam([...team, {
      id: Date.now().toString(),
      name: '',
      role: '',
      walletAddress: '',
      percentage: 0,
    }])
  }

  const removeTeamMember = (id: string) => {
    if (team.length > 1) {
      setTeam(team.filter(member => member.id !== id))
    }
  }

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string | number) => {
    setTeam(team.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  const distributeEqually = () => {
    const equalPercentage = Math.floor(100 / team.length)
    const remainder = 100 - (equalPercentage * team.length)
    
    setTeam(team.map((member, index) => ({
      ...member,
      percentage: index === 0 ? equalPercentage + remainder : equalPercentage
    })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid || !title) {
      alert('Por favor completá todos los campos correctamente')
      return
    }

    if (team.length < 2) {
      alert('⚠️ Necesitás al menos 2 colaboradores para crear una canción.\n\nEl contrato de splits requiere mínimo 2 participantes.')
      return
    }

    setIsCreating(true)
    
    try {
      console.log('🎵 Creando canción vía API backend...')
      console.log('Title:', title)
      console.log('Team:', team)

      // Llamar a la API del backend que hace todo:
      // 1. Llama al Factory en blockchain
      // 2. Guarda metadata en Arkiv
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songTitle: title,
          artist: team[0]?.name || 'Unknown Artist',
          genre: 'Hip Hop', // Podés agregar un selector después
          coverImageUrl: '', // Podés agregar upload después
          audioUrl: '', // Podés agregar upload después
          collaborators: team.map(m => ({
            name: m.name,
            role: m.role,
            walletAddress: m.walletAddress,
            percentage: m.percentage
          }))
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error desconocido en la API');
      }

      console.log('✅ Canción creada exitosamente!');
      console.log('TX Hash:', result.data.txHash);
      console.log('Block:', result.data.blockNumber);
      console.log('SongNFT:', result.data.songNFT);
      console.log('RevenueSplitter:', result.data.revenueSplitter);
      console.log('Arkiv Entity Key:', result.data.arkiv.entityKey);
      console.log('Metadata URI:', result.data.arkiv.metadataUri);
      
      // Redirigir a la página de canciones
      router.push('/songs');
      
      // Mostrar mensaje de éxito después de redirigir
      setTimeout(() => {
        alert(`🎉 ¡Canción "${title}" creada exitosamente!

📝 TX: ${result.data.txHash.slice(0, 10)}...${result.data.txHash.slice(-8)}
🎵 NFT: ${result.data.songNFT}
💰 Splitter: ${result.data.revenueSplitter}

✅ La canción ya aparece en tu lista`);
      }, 500);

    } catch (error: any) {
      console.error('❌ Error al crear la canción:', error);
      alert(`❌ Error al crear la canción:\n\n${error.message || 'Error desconocido'}`);
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <div className="text-[64px] mb-6">🎵</div>
          <h2 className="text-[32px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Conectá tu billetera
          </h2>
          <p className="text-[18px] mb-8" style={{ color: '#C2CAD7' }}>
            Para crear una canción, primero necesitás conectar tu billetera
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
        <div className="mb-8">
          <Link href="/songs" className="inline-flex items-center gap-2 text-[14px] mb-4" style={{ color: '#8E8E93' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
          
          <h1 className="text-[40px] font-bold mb-3" style={{ color: '#FFFFFF' }}>
            Crear nueva canción
          </h1>
          <p className="text-[18px]" style={{ color: '#C2CAD7' }}>
            Registrá tu música y armá tu equipo. Es más simple de lo que pensás.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 'info' && (
            <div 
              className="rounded-[24px] p-8 border mb-6"
              style={{
                background: 'rgba(28, 28, 30, 0.8)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-[15px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                    Título de la canción <span style={{ color: '#FC3C44' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Summer Vibes"
                    className="w-full h-[52px] px-4 rounded-[12px] border text-[16px]"
                    style={{
                      background: 'rgba(44, 44, 46, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                    Link de Metadata (Arkiv)
                  </label>
                  <input
                    type="text"
                    value=""
                    disabled
                    placeholder="Se generará automáticamente"
                    className="w-full h-[52px] px-4 rounded-[12px] border text-[16px] font-mono"
                    style={{
                      background: 'rgba(44, 44, 46, 0.5)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#8E8E93',
                    }}
                  />
                  <p className="text-[13px] mt-2" style={{ color: '#8E8E93' }}>
                    💡 La metadata se guardará automáticamente en Arkiv al crear la canción
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('team')}
                  disabled={!title}
                  className="w-full h-[56px] rounded-full text-[16px] font-semibold transition-all disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 100%)',
                    color: '#FFFFFF',
                  }}
                >
                  Continuar → Armar equipo
                </button>
              </div>
            </div>
          )}

          {currentStep === 'team' && (
            <>
              <div 
                className="rounded-[24px] p-8 border mb-6"
                style={{
                  background: 'rgba(28, 28, 30, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[24px] font-bold" style={{ color: '#FFFFFF' }}>
                      👥 Tu equipo
                    </h2>
                    <p className="text-[14px] mt-1" style={{ color: '#C2CAD7' }}>
                      Agregá a todos los que participaron en esta canción
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={distributeEqually}
                    className="px-4 py-2 rounded-[10px] text-[13px] font-medium border transition-all"
                    style={{
                      background: 'rgba(52, 199, 89, 0.1)',
                      borderColor: 'rgba(52, 199, 89, 0.3)',
                      color: '#34C759',
                    }}
                  >
                    ⚡ Repartir en partes iguales
                  </button>
                </div>

                <div className="space-y-4">
                  {team.map((member, index) => (
                    <div
                      key={member.id}
                      className="p-6 rounded-[16px] border"
                      style={{
                        background: 'rgba(44, 44, 46, 0.6)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold"
                            style={{
                              background: 'linear-gradient(135deg, #FC3C44 0%, #FF6B9D 100%)',
                              color: '#FFFFFF',
                            }}
                          >
                            {index + 1}
                          </div>
                          <span className="text-[15px] font-semibold" style={{ color: '#FFFFFF' }}>
                            Colaborador {index + 1}
                          </span>
                        </div>
                        
                        {team.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(member.id)}
                            className="text-[13px] px-3 py-1 rounded-[8px] transition-all"
                            style={{
                              background: 'rgba(255, 59, 48, 0.1)',
                              color: '#FF3B30',
                            }}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[13px] font-medium mb-2" style={{ color: '#C2CAD7' }}>
                            Nombre o Alias
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full h-[44px] px-3 rounded-[10px] border text-[14px]"
                            style={{
                              background: 'rgba(28, 28, 30, 0.8)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: '#FFFFFF',
                            }}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium mb-2" style={{ color: '#C2CAD7' }}>
                            Rol en la canción
                          </label>
                          <select
                            value={member.role}
                            onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                            className="w-full h-[44px] px-3 rounded-[10px] border text-[14px]"
                            style={{
                              background: 'rgba(28, 28, 30, 0.8)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: '#FFFFFF',
                            }}
                            required
                          >
                            <option value="">Seleccioná un rol...</option>
                            {COMMON_ROLES.map(role => (
                              <option key={role.value} value={role.value}>
                                {role.emoji} {role.value}
                              </option>
                            ))}
                            <option value="Otro">✨ Otro</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[13px] font-medium mb-2" style={{ color: '#C2CAD7' }}>
                          Dirección de billetera
                          <span className="ml-2 text-[12px]" style={{ color: '#8E8E93' }}>
                            (donde recibirá los pagos)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={member.walletAddress}
                          onChange={(e) => updateTeamMember(member.id, 'walletAddress', e.target.value)}
                          placeholder="0x..."
                          className="w-full h-[44px] px-3 rounded-[10px] border text-[14px] font-mono"
                          style={{
                            background: 'rgba(28, 28, 30, 0.8)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#FFFFFF',
                          }}
                          required
                        />
                        {index === 0 && (
                          <button
                            type="button"
                            onClick={() => address && updateTeamMember(member.id, 'walletAddress', address)}
                            className="text-[12px] mt-2 px-3 py-1 rounded-[6px]"
                            style={{
                              background: 'rgba(252, 60, 68, 0.1)',
                              color: '#FC3C44',
                            }}
                          >
                            Usar mi dirección
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium mb-2" style={{ color: '#C2CAD7' }}>
                          Porcentaje de ganancias: <strong style={{ color: '#FC3C44' }}>{member.percentage}%</strong>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={member.percentage}
                          onChange={(e) => updateTeamMember(member.id, 'percentage', parseInt(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #FC3C44 0%, #FC3C44 ${member.percentage}%, rgba(255, 255, 255, 0.1) ${member.percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addTeamMember}
                  className="w-full h-[48px] rounded-[12px] text-[14px] font-medium border transition-all mt-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                  }}
                >
                  + Agregar otro colaborador
                </button>
              </div>

              <div 
                className="rounded-[16px] p-6 border mb-6"
                style={{
                  background: totalPercentage === 100 
                    ? 'rgba(52, 199, 89, 0.1)' 
                    : totalPercentage > 100
                    ? 'rgba(255, 59, 48, 0.1)'
                    : 'rgba(255, 214, 10, 0.1)',
                  borderColor: totalPercentage === 100 
                    ? 'rgba(52, 199, 89, 0.3)' 
                    : totalPercentage > 100
                    ? 'rgba(255, 59, 48, 0.3)'
                    : 'rgba(255, 214, 10, 0.3)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-[32px]">
                      {totalPercentage === 100 ? '✅' : totalPercentage > 100 ? '❌' : '⚠️'}
                    </div>
                    <div>
                      <p className="text-[16px] font-semibold" style={{ 
                        color: totalPercentage === 100 ? '#34C759' : totalPercentage > 100 ? '#FF3B30' : '#FFD60A' 
                      }}>
                        {totalPercentage === 100 
                          ? '¡Perfecto! Los porcentajes suman 100%' 
                          : totalPercentage > 100
                          ? 'Los porcentajes exceden el 100%'
                          : 'Los porcentajes deben sumar 100%'
                        }
                      </p>
                      <p className="text-[14px]" style={{ color: '#C2CAD7' }}>
                        Total actual: <strong>{totalPercentage}%</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || isCreating}
                className="w-full h-[60px] rounded-full text-[17px] font-bold transition-all disabled:opacity-40"
                style={{
                  background: isValid 
                    ? 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)'
                    : 'rgba(142, 142, 147, 0.3)',
                  color: '#FFFFFF',
                  boxShadow: isValid ? '0 8px 24px -6px rgba(252, 60, 68, 0.6)' : 'none',
                }}
              >
                {isCreating ? '⏳ Creando canción...' : '🎵 Crear canción y registrar en blockchain'}
              </button>

              <p className="text-[13px] text-center mt-4" style={{ color: '#8E8E93' }}>
                Se creará un contrato inteligente que distribuirá automáticamente las ganancias
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
