'use client'

import { Card, Button, Badge } from "@/components/ui";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-musicus-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section con gradiente musical */}
        <div className="relative overflow-hidden pt-20 pb-16">
          {/* Blur decorativo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-musicus-accent-primary/20 blur-[120px] rounded-full" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-musicus-full bg-gradient-music-subtle border border-musicus-accent-primary/20 mb-6">
              <svg className="w-4 h-4 text-musicus-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-caption text-musicus-accent-primary font-semibold">Hackathon 2025</span>
            </div>
            
            <h1 className="text-hero text-musicus-text-primary mb-4">
              Welcome to{" "}
              <span className="bg-gradient-music bg-clip-text text-transparent">
                MusiciUS
              </span>
            </h1>
            
            <p className="text-body text-musicus-text-secondary max-w-2xl mx-auto mb-8">
              The decentralized music platform that puts creators first. 
              Stream, mint, and trade music NFTs on the blockchain.
            </p>
            
            {!isConnected && (
              <div className="flex flex-col items-center gap-4 animate-scalePop">
                <svg className="w-6 h-6 text-musicus-accent-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <p className="text-caption text-musicus-text-tertiary">
                  Connect your wallet to start exploring
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid - Solo cuando está conectado */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto pb-16">
            {/* Mini Player Card */}
            <div className="md:col-span-2 lg:col-span-3">
              <div className="relative bg-musicus-bg-secondary/80 backdrop-blur-musicus border border-white/10 rounded-musicus-2xl p-6 shadow-musicus-lg transition-all duration-musicus hover:bg-musicus-bg-tertiary/90 active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  {/* Album Cover */}
                  <div className="relative w-16 h-16 rounded-musicus-lg bg-gradient-music shadow-musicus-accent overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-heading text-musicus-text-primary truncate mb-1">
                      Featured Track
                    </h4>
                    <p className="text-caption text-musicus-text-secondary truncate">
                      Artist Name • Album Name
                    </p>
                  </div>
                  
                  {/* Play Button */}
                  <button className="w-12 h-12 rounded-musicus-full bg-white flex items-center justify-center shadow-musicus-md active:scale-90 transition-transform duration-200 flex-shrink-0">
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-small text-musicus-text-tertiary">1:23</span>
                  <div className="flex-1 h-1 bg-white/10 rounded-musicus-full overflow-hidden">
                    <div className="h-full w-[60%] bg-gradient-music rounded-musicus-full transition-all duration-300" />
                  </div>
                  <span className="text-small text-musicus-text-tertiary">3:45</span>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              }
              title="Stream Music"
              description="Listen to your favorite tracks directly on the blockchain"
            />
            
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              }
              title="Mint NFTs"
              description="Transform your music into unique digital collectibles"
            />
            
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
              }
              title="Earn Royalties"
              description="Get paid directly for every stream and sale"
            />
          </div>
        )}

        {/* CTA Section */}
        {isConnected && (
          <div className="max-w-2xl mx-auto pb-20">
            <div className="relative bg-gradient-card backdrop-blur-musicus border border-musicus-accent-primary/20 rounded-musicus-2xl p-8 text-center shadow-musicus-lg">
              <div className="absolute inset-0 bg-gradient-music opacity-5 rounded-musicus-2xl" />
              <div className="relative z-10">
                <h2 className="text-title text-musicus-text-primary mb-3">
                  Ready to Create?
                </h2>
                <p className="text-body text-musicus-text-secondary mb-6">
                  Start uploading your music and reach a global audience
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button className="relative overflow-hidden h-[52px] px-8 bg-gradient-music rounded-musicus-full text-musicus-text-primary text-[15px] font-semibold tracking-tight shadow-musicus-accent transition-all duration-musicus ease-musicus active:scale-[0.96] hover:shadow-musicus-accent-lg w-full sm:w-auto">
                    <span className="relative z-10">Upload Music</span>
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </button>
                  <button className="h-[52px] px-8 bg-musicus-bg-tertiary/80 backdrop-blur-musicus border border-white/10 rounded-musicus-full text-musicus-text-primary text-[15px] font-semibold tracking-tight transition-all duration-musicus active:scale-[0.96] hover:bg-musicus-bg-elevated/80 w-full sm:w-auto">
                    Explore Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente auxiliar para las feature cards
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="relative bg-musicus-bg-secondary/80 backdrop-blur-musicus border border-white/10 rounded-musicus-2xl p-6 shadow-musicus-md transition-all duration-musicus hover:bg-musicus-bg-tertiary/90 hover:-translate-y-1 active:scale-[0.98]">
      <div className="w-12 h-12 rounded-musicus-lg bg-gradient-music flex items-center justify-center text-white mb-4 shadow-musicus-accent">
        {icon}
      </div>
      <h3 className="text-heading text-musicus-text-primary mb-2">
        {title}
      </h3>
      <p className="text-caption text-musicus-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  )
}
