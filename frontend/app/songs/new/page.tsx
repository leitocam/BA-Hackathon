'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SPLIT_TRACK_FACTORY_ABI, getFactoryAddress } from '@/lib/web3/contracts'

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
  const { isConnected, address, chainId } = useAccount()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [metadataUri, setMetadataUri] = useState('')
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

  const { 
    data: hash,
    writeContract,
    isPending,
    error: writeError 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

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
    
    if (!isValid || !title || !metadataUri) {
      alert('Por favor completá todos los campos correctamente')
      return
    }

    if (!chainId) {
      alert('No se pudo detectar la red. Por favor reconectá tu wallet.')
      return
    }

    const factoryAddress = getFactoryAddress(chainId)
    
    if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
      alert('⚠️ El contrato Factory no está deployado en esta red. Por favor pedile a Dev A la dirección del contrato.')
      console.error('Factory address not configured for chainId:', chainId)
      return
    }

    setIsCreating(true)
    
    try {
      const recipients = team.map(m => m.walletAddress as `0x${string}`)
      const percentages = team.map(m => BigInt(m.percentage))
      
      const symbol = title
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 10) || 'SONG'

      console.log('🎵 Creando canción on-chain...')
      console.log('Factory Address:', factoryAddress)
      console.log('Title:', title)
      console.log('Symbol:', symbol)
      console.log('Metadata URI:', metadataUri)
      console.log('Recipients:', recipients)
      console.log('Percentages:', percentages)

      writeContract({
        address: factoryAddress,
        abi: SPLIT_TRACK_FACTORY_ABI,
        functionName: 'createSong',
        args: [title, symbol, metadataUri, recipients, percentages],
      })

    } catch (error: any) {
      console.error('Error creating song:', error)
      alert(`Error al crear la canción: ${error.message || 'Error desconocido'}`)
      setIsCreating(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      console.log('✅ Canción creada exitosamente!')
      console.log('Transaction hash:', hash)
      alert('🎉 ¡Canción creada exitosamente!')
      setIsCreating(false)
      router.push('/songs')
    }
  }, [isSuccess])

  useEffect(() => {
    if (writeError) {
      console.error('❌ Error en transacción:', writeError)
      alert(`Error: ${writeError.message}`)
      setIsCreating(false)
    }
  }, [writeError])

  useEffect(() => {
    setIsCreating(isPending || isConfirming)
  }, [isPending, isConfirming])

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
                    Link de Metadata (Arkiv) <span style={{ color: '#FC3C44' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={metadataUri}
                    onChange={(e) => setMetadataUri(e.target.value)}
                    placeholder="ipfs://QmXxxx..."
                    className="w-full h-[52px] px-4 rounded-[12px] border text-[16px] font-mono"
                    style={{
                      background: 'rgba(44, 44, 46, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                    }}
                    required
                  />
                  <p className="text-[13px] mt-2" style={{ color: '#8E8E93' }}>
                    💡 Subí tu metadata a <a href="https://arkiv.org" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#FC3C44' }}>Arkiv</a> y pegá el link acá
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('team')}
                  disabled={!title || !metadataUri}
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
                {isPending && '⏳ Esperando confirmación en wallet...'}
                {isConfirming && '⏳ Confirmando transacción...'}
                {!isPending && !isConfirming && '🎵 Crear canción y registrar en blockchain'}
              </button>

              <p className="text-[13px] text-center mt-4" style={{ color: '#8E8E93' }}>
                Se creará un contrato inteligente que distribuirá automáticamente las ganancias
              </p>

              {hash && (
                <div className="mt-4 p-4 rounded-[12px] border" style={{
                  background: 'rgba(52, 199, 89, 0.1)',
                  borderColor: 'rgba(52, 199, 89, 0.3)',
                }}>
                  <p className="text-[13px] mb-2" style={{ color: '#34C759' }}>
                    ✅ Transacción enviada
                  </p>
                  <a 
                    href={`https://sepolia.scrollscan.com/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-mono break-all underline"
                    style={{ color: '#FC3C44' }}
                  >
                    Ver en Scrollscan
                  </a>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  )
}
