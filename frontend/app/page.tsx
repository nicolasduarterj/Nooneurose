'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phase } from '@/types/phase'
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();

  const [phase, setPhase] = useState<Phase>('black');

  const isVisible = phase !== 'black';
  const isLeaving = phase === 'leaving';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginClick = async () => {

    const onLoginSuccess = () => {
      setTimeout(() => setPhase('leaving'), 800);
      setTimeout(() => router.push('/chat'), 1250);
    }

    if (phase !== 'idle') return;

    try{
      await login({ email, password }, onLoginSuccess);
    }
    catch(error){
      setLoginError(error instanceof Error ? error.message : 'Falha ao realizar login');
    }
  };

    useEffect(() => {
      const t1 = setTimeout(() => setPhase('fadein'), 120);
      const t2 = setTimeout(() => setPhase('idle'), 1400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const handleRegisterClick = () => {
      if (phase !== 'idle') return;
      setTimeout(() => setPhase('leaving'), 800);
      setTimeout(() => router.push('cadastro'), 1250);
    }




  return (
    <main className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">

      <div className="bg-muted" />

      {/*Garantia de transição fluida*/}
      {isLeaving && (
        <div className="page-blackout absolute inset-0 bg-black z-50" />
      )}

      {/* Chamariz */}
      <div
        className={`flex flex-col items-center gap-10 ${isVisible ? 'page-reveal' : 'opacity-0'}`}
        style={{ marginTop: '-12vh' }}
      >
        <div className={`flex flex-col items-center gap-2`}>
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
        <div className="flex flex-col items-center gap-2">
          <input 
            className="rounded-2xl p-5 flex items-center justify-center"
            style={{
              background: 'rgba(255, 0, 122, 0.08)',
              border: '1px solid rgba(255, 0, 122, 0.18)',
              width: 200,
              height: 50,
            }}
            type="text"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

          <input className="rounded-2xl p-5 flex items-center justify-center"
            style={{
              background: 'rgba(255, 0, 122, 0.08)',
              border: '1px solid rgba(255, 0, 122, 0.18)',
              width: 200,
              height: 50,
            }}
            type="password"
            name="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <div className={"flex flex-col items-center gap-10 w-full mt-2"}>
            <button className={"rounded-2xl p-5 flex items-center justify-center cursor-pointer"}
              style={{
                backgroundColor: '#FF007A',
                border: '1px solid rgb(255, 0, 123)',
                width: 200,
                height: 50,
              }}
              onClick={handleLoginClick}>
              Entrar
            </button>
            <button className={"rounded-2xl p-5 flex items-center justify-center cursor-pointer"}
              style={{
                border: '2px solid #FF007A',
                width: 200,
                height: 50,
                color: '#ffffff',
              }}
              onClick={handleRegisterClick}>
              Criar nova conta
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}