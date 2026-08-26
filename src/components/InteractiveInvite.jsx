import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, MapPin, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function InteractiveInvite() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestCode, setGuestCode] = useState('');
  const audioRef = useRef(null);

  // Ler código do convidado da URL (?convite=XXXX ou ?code=XXXX)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('convite') || params.get('code') || params.get('c') || '';
      setGuestCode(code.trim().toUpperCase());
    } catch (e) {
      console.warn('Erro ao ler parâmetro:', e);
    }
  }, []);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Tocar música com permissão de interação do usuário
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Audio autoplay prevented:', err);
        });
      }
    }
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.warn);
    }
  };

  const targetSiteUrl = guestCode ? `/?convite=${encodeURIComponent(guestCode)}#rsvp` : '/#rsvp';
  const mapsUrl = "https://www.google.com/maps/place/S%C3%ADtio+S%C3%A3o+Jorge/@-23.74402,-46.5774639,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce413d88145c17:0x5856713a1bc092ef!8m2!3d-23.74402!4d-46.574889!16s%2Fg%2F1tf7hswn";

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#FAF1E1',
      backgroundImage: 'radial-gradient(#F3E5D0 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      color: '#745D57',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isOpen ? '20px 12px 60px' : '20px 12px',
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Elemento de Áudio */}
      <audio
        ref={audioRef}
        src="/assets/canva/audio/91ce5d64504d4d9362c14ff164a62f45.m4a"
        loop
        preload="auto"
      />

      {/* Botão Flutuante de Música */}
      <button
        onClick={toggleAudio}
        title={isPlaying ? "Pausar música" : "Tocar música"}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(116, 93, 87, 0.2)',
          borderRadius: '50%',
          width: '46px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(116, 93, 87, 0.15)',
          color: '#745D57',
          transition: 'all 0.3s ease'
        }}
      >
        {isPlaying ? <Volume2 size={20} className="pulse-icon" /> : <VolumeX size={20} opacity={0.6} />}
      </button>

      {/* ============================================================
          FASE 1: ENVELOPE FECHADO (CLIQUE PARA ABRIR)
          ============================================================ */}
      {!isOpen && (
        <div 
          onClick={handleOpenEnvelope}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            textAlign: 'center',
            maxWidth: '460px',
            width: '100%',
            animation: 'fadeInUp 0.8s ease-out'
          }}
        >
          {/* Subtítulo Topo */}
          <p style={{
            fontSize: '15px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#786938',
            marginBottom: '16px',
            fontWeight: 500
          }}>
            a celebração do amor de
          </p>

          {/* Monograma Estilizado dos Noivos */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px'
          }}>
            <span style={{ fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive", fontSize: '46px', color: '#745D57', lineHeight: 1 }}>A</span>
            <span style={{ fontSize: '20px', letterSpacing: '0.15em', fontWeight: 600, color: '#745D57' }}>NA CLARA</span>
            <span style={{ fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive", fontSize: '32px', color: '#745D57', margin: '0 4px' }}>&</span>
            <span style={{ fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive", fontSize: '46px', color: '#745D57', lineHeight: 1 }}>D</span>
            <span style={{ fontSize: '20px', letterSpacing: '0.15em', fontWeight: 600, color: '#745D57' }}>ENER</span>
          </div>

          {/* Envelope 3D com Selo de Cera */}
          <div style={{
            position: 'relative',
            width: '320px',
            height: '220px',
            backgroundColor: '#EFE7DA',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(116, 93, 87, 0.22), 0 6px 16px rgba(116, 93, 87, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #DFD5C6',
            transition: 'transform 0.3s ease',
            margin: '0 auto 28px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            {/* Aba Triangular do Envelope */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              width: 0,
              height: 0,
              borderLeft: '160px solid transparent',
              borderRight: '160px solid transparent',
              borderTop: '110px solid #E5DC CE',
              borderTopColor: '#E2D8C9',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))'
            }} />

            {/* Selo de Cera Dourado / Terracota */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#A65B4E',
              backgroundImage: 'radial-gradient(circle at 30% 30%, #C27062, #8A463B)',
              boxShadow: '0 6px 18px rgba(138, 70, 59, 0.45), inset 0 2px 4px rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              cursor: 'pointer'
            }}>
              <span style={{
                fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive",
                fontSize: '32px',
                color: '#FFF',
                lineHeight: 1,
                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
              }}>
                AD
              </span>
            </div>

            {/* Renda Floral Decorativa Sobreposta */}
            <img 
              src="/assets/canva/media/48699a11ae3ca8c5deee074f189acfd6.png" 
              alt="Lace Decor"
              style={{
                position: 'absolute',
                bottom: '-15px',
                right: '-15px',
                width: '120px',
                opacity: 0.85,
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Dica de Clique */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(116, 93, 87, 0.15)',
            boxShadow: '0 4px 12px rgba(116, 93, 87, 0.08)'
          }}>
            <Sparkles size={16} color="#786938" />
            <span style={{
              fontSize: '14px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#786938',
              fontWeight: 600
            }}>
              Clique no envelope para abrir
            </span>
          </div>
        </div>
      )}

      {/* ============================================================
          FASE 2: CARTA DO CONVITE ABERTA (DESIGN NATIVO ELEGANTE)
          ============================================================ */}
      {isOpen && (
        <div style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FCFAF6',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(116, 93, 87, 0.25), 0 8px 24px rgba(116, 93, 87, 0.12)',
          border: '1px solid #EBE2D5',
          padding: '48px 32px',
          boxSizing: 'border-box',
          textAlign: 'center',
          position: 'relative',
          animation: 'slideUpOpen 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          {/* Detalhes de Renda nos Cantos */}
          <img 
            src="/assets/canva/media/48699a11ae3ca8c5deee074f189acfd6.png" 
            alt="Lace Decor Top"
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              width: '130px',
              opacity: 0.8,
              pointerEvents: 'none',
              transform: 'rotate(-25deg)'
            }}
          />
          <img 
            src="/assets/canva/media/07751fd54f213e49564d2615e3211de6.png" 
            alt="Lace Decor Bottom"
            style={{
              position: 'absolute',
              bottom: '-25px',
              right: '-25px',
              width: '150px',
              opacity: 0.8,
              pointerEvents: 'none'
            }}
          />

          {/* Subtítulo */}
          <p style={{
            fontSize: '14px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#786938',
            marginBottom: '16px',
            fontWeight: 500
          }}>
            a celebração do amor de
          </p>

          {/* Monograma do Casal */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '28px'
          }}>
            <span style={{ fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive", fontSize: '52px', color: '#745D57', lineHeight: 1 }}>A</span>
            <span style={{ fontSize: '22px', letterSpacing: '0.15em', fontWeight: 600, color: '#745D57' }}>NA CLARA</span>
            <span style={{ fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive", fontSize: '38px', color: '#745D57', margin: '0 6px' }}>&</span>
            <span style={{ fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive", fontSize: '52px', color: '#745D57', lineHeight: 1 }}>D</span>
            <span style={{ fontSize: '22px', letterSpacing: '0.15em', fontWeight: 600, color: '#745D57' }}>ENER</span>
          </div>

          {/* Divisória Sutil */}
          <div style={{
            width: '60px',
            height: '1px',
            backgroundColor: '#D9CFC4',
            margin: '0 auto 28px'
          }} />

          {/* Versículo Bíblico */}
          <blockquote style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#745D57',
            maxWidth: '380px',
            margin: '0 auto 36px',
            padding: '0 10px'
          }}>
            “Acima de tudo, porém, revistam-se do amor, que é o elo perfeito”
            <footer style={{
              fontSize: '13px',
              fontStyle: 'normal',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#8A7B58',
              marginTop: '8px'
            }}>
              Colossenses 3:14
            </footer>
          </blockquote>

          {/* Frase Caligráfica Principal (100% Nítida e Sem Sobreposição) */}
          <div style={{
            margin: '0 auto 36px',
            padding: '0 10px'
          }}>
            <h2 style={{
              fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive",
              fontSize: 'clamp(40px, 10vw, 56px)',
              fontWeight: 'normal',
              color: '#745D57',
              lineHeight: 1.2,
              margin: 0,
              textRendering: 'geometricPrecision',
              wordBreak: 'normal',
              letterSpacing: '0.01em'
            }}>
              Nossa história vai começar...
            </h2>
          </div>

          {/* Data Marcante */}
          <div style={{
            fontSize: 'clamp(28px, 6vw, 36px)',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#786938',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            marginBottom: '36px'
          }}>
            28.11.2026
          </div>

          {/* Selo Marrom Ondulado (Esperamos Vocês) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '220px',
            height: '110px',
            backgroundColor: '#4A3B37',
            borderRadius: '50% / 40%',
            boxShadow: '0 8px 25px rgba(74, 59, 55, 0.35)',
            marginBottom: '40px',
            padding: '10px'
          }}>
            <span style={{
              fontFamily: "'Sloop Script Pro', 'Sloop Script', cursive",
              fontSize: 'clamp(28px, 7vw, 38px)',
              color: '#F9F6F0',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              esperamos vocês
            </span>
          </div>

          {/* Botões de Ação */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: '340px',
            margin: '0 auto'
          }}>
            {/* Botão: O Local */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '12px',
                border: '1px solid #786938',
                backgroundColor: 'transparent',
                color: '#786938',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#786938';
                e.currentTarget.style.color = '#FFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#786938';
              }}
            >
              <MapPin size={18} /> O Local (Sítio São Jorge)
            </a>

            {/* Botão: Clique para o Site / Confirmar Presença */}
            <a
              href={targetSiteUrl}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '16px 28px',
                borderRadius: '12px',
                backgroundColor: '#745D57',
                color: '#FFF',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 6px 18px rgba(116, 93, 87, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5c4843'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#745D57'}
            >
              Clique para o Site <ArrowRight size={18} />
            </a>
          </div>

          {/* Rodapé Romântico */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '36px',
            fontSize: '13px',
            color: '#A99B88',
            letterSpacing: '0.1em'
          }}>
            <Heart size={14} color="#C27062" fill="#C27062" />
            <span>Feito com amor para o nosso grande dia</span>
          </div>
        </div>
      )}

      {/* Keyframes de Animação CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUpOpen {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .pulse-icon {
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
