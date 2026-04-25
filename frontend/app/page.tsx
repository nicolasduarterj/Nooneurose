'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Phase =
  | 'black'    // tela preta inicial
  | 'fadein'   // conteúdo surge
  | 'idle'     // esperando interação
  | 'falling'  // cérebro caindo
  | 'leaving'; // navegando
 
export default function Home() {
  const [phase, setPhase] = useState<Phase>('black');
  const router = useRouter();
 
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fadein'), 120);
    const t2 = setTimeout(() => setPhase('idle'), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
 
  const handleBrainClick = () => {
    if (phase !== 'idle') return;
    setPhase('falling');
    setTimeout(() => setPhase('leaving'), 800);
    setTimeout(() => router.push('chat'), 1250);
  };
 
  const isVisible   = phase !== 'black';
  const isFalling   = phase === 'falling' || phase === 'leaving';
  const isLeaving   = phase === 'leaving';
 

 
  return (
    <main className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
 
      <div className="bg-fog" />

      {/*Garantia de transição fluida*/}
      {isLeaving && (
        <div className="page-blackout absolute inset-0 bg-black z-50" />
      )}

      {/* Chamariz */}
      <div
        className={`flex flex-col items-center gap-10 ${isVisible ? 'page-reveal' : 'opacity-0'}`}
        style={{marginTop: '-12vh'}}
      >
        <div className={`flex flex-col items-center gap-2 ${isFalling ? 'title-fadeout' : ''}`}>
          <span
            className="text-xs tracking-[0.35em] uppercase text-white/50"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Bem vindo a experiencia
          </span>
 
          <h1
            className="text-5xl font-bold tracking-tight leading-none"
            style={{ fontFamily: "'Anta', sans-serif" }}
          >
            <span style={{ color: '#FF007A' }}>NOO</span>
            <span className="text-white">NEUROSE</span>
          </h1>
        </div>
 
        {/* Cérebro & Texto */}
        <div
          className={`
            flex flex-col items-center gap-3 select-none
            ${isFalling ? 'brain-falling' : ''}
            ${phase === 'idle' ? 'brain-idle' : ''}
          `}
          onClick={handleBrainClick}
          style={{ willChange: 'transform, opacity' }}
        >
          <div
            className="rounded-2xl p-5 flex items-center justify-center"
            style={{
              background: 'rgba(255, 0, 122, 0.08)',
              border: '1px solid rgba(255, 0, 122, 0.18)',
              width: 88,
              height: 88,
            }}
          >
            <Image
              src="/brain.svg"  
              alt="Cérebro"
              width={52}
              height={52}
              priority
              draggable={false}
            />
          </div>

          <span
            className={`text-xs text-white/40 tracking-wide transition-opacity duration-300 ${isFalling ? 'opacity-0' : 'opacity-100'}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Clique para iniciar
          </span>
        </div>
      </div>
    </main>
  );
}