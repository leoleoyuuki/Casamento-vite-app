import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';

export default function OurStory() {
  const photos = [
    '/assets/00003019-PHOTO-2026-08-02-17-34-56.jpg',
    '/assets/00003020-PHOTO-2026-08-02-17-34-56.jpg',
    '/assets/00003021-PHOTO-2026-08-02-17-34-57.jpg',
    '/assets/00003022-PHOTO-2026-08-02-17-34-57.jpg',
    '/assets/00003023-PHOTO-2026-08-02-17-34-57.jpg',
    '/assets/00003024-PHOTO-2026-08-02-17-34-57.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Suporte a gestos de swipe no mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Teclado para navegar ou fechar modal fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="historia" style={{ padding: '88px 0', backgroundColor: '#FAF6F0', position: 'relative', overflow: 'hidden' }}>
      {/* Elementos Gráficos Florais de Enfeite */}
      <img 
        src="/assets/flor1.png" 
        alt="" 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-40px',
          width: '200px',
          height: 'auto',
          opacity: 0.3,
          pointerEvents: 'none',
          transform: 'rotate(15deg)',
          zIndex: 1
        }}
      />
      <img 
        src="/assets/flor2.png" 
        alt="" 
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-30px',
          width: '160px',
          height: 'auto',
          opacity: 0.28,
          pointerEvents: 'none',
          transform: 'rotate(-10deg)',
          zIndex: 1
        }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Cabeçalho */}
        <div className="section-header">
          <span className="section-subtitle">SEJA BEM-VINDO AO NOSSO ESPAÇO</span>
          <h2 className="section-title">Nossa História & Boas-Vindas</h2>
          <div className="section-divider">
            <Heart size={14} color="var(--color-marrom)" />
          </div>
        </div>

        {/* Grid 2 Colunas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>

          {/* Galeria de Fotos / Shadcn UI Carousel */}
          <div>
            <div 
              className="shadcn-carousel"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                aspectRatio: '4/5',
                marginBottom: '16px',
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {/* Imagem principal com transição suave */}
              <img 
                key={currentIndex}
                src={photos[currentIndex]} 
                alt={`Ana Clara e Dener - Foto ${currentIndex + 1}`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  animation: 'fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onClick={() => setIsFullscreen(true)}
              />

              {/* Top-Right Pill Counter Badge */}
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                backgroundColor: 'rgba(44, 34, 30, 0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <ImageIcon size={13} color="#FFFFFF" />
                <span>{currentIndex + 1} / {photos.length}</span>
              </div>

              {/* Top-Left Expand / Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                aria-label="Expandir foto"
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(44, 34, 30, 0.55)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Maximize2 size={14} />
              </button>



              {/* Overlay inferior com Monograma */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 20px 16px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(44, 34, 30, 0.75) 100%)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between'
              }}>
                <span className="font-script" style={{ fontSize: '30px', textShadow: '0 2px 8px rgba(0,0,0,0.5)', color: '#FFFFFF' }}>
                  Ana Clara & Dener
                </span>
              </div>
            </div>

            {/* Trilho de Miniaturas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '2px'
                }}
              >
                {photos.map((photo, idx) => {
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Ver foto ${idx + 1}`}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: isActive ? '0 0 0 2px var(--color-marrom)' : 'none',
                        opacity: isActive ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        padding: 0,
                        backgroundColor: '#FAF6F0'
                      }}
                    >
                      <img 
                        src={photo} 
                        alt={`Miniatura ${idx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dots de navegação */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Ir para slide ${idx + 1}`}
                    style={{
                      width: currentIndex === idx ? '16px' : '5px',
                      height: '5px',
                      borderRadius: '2px',
                      backgroundColor: currentIndex === idx ? 'var(--color-marrom)' : 'rgba(116, 93, 87, 0.25)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Carta dos Noivos */}
          <div className="glass-card" style={{ padding: '36px', borderRadius: '8px' }}>
            <span style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: 600, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: 'var(--color-marrom)', 
              marginBottom: '16px', 
              opacity: 0.85 
            }}>
              MENSAGEM DOS NOIVOS
            </span>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '19px',
              lineHeight: 1.6,
              color: 'var(--text-dark)',
              marginBottom: '16px'
            }}>
              É uma imensa alegria viver essa fase ao lado de vocês, que sempre fizeram parte das nossas vidas.
            </p>

            <p style={{
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
              marginBottom: '16px'
            }}>
              Esse site foi criado para reunir todas as informações do nosso grande dia, mas acima de tudo, para compartilhar um pouquinho da nossa história.
            </p>

            <p style={{
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
              marginBottom: '20px'
            }}>
              Esperamos que este espaço ajude vocês a encontrar tudo o que precisam para viver esse dia conosco. Mas, se ficarem com qualquer dúvida, não deixem de falar conosco.
            </p>

            <div style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(116, 93, 87, 0.06)',
              borderLeft: '3px solid var(--color-marrom)',
              borderRadius: '4px',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-marrom)' }}>
                <strong>Ah, não se esqueçam de confirmar sua presença!</strong> Essa parte é muito importante para nós!
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--text-muted)' }}>
                Está cada dia mais perto.
              </p>
              <p className="font-script" style={{ fontSize: '34px', color: 'var(--color-marrom)', marginTop: '2px' }}>
                Com carinho, Ana Clara & Dener
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Lightbox Fullscreen */}
      {isFullscreen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(28, 22, 20, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setIsFullscreen(false)}
        >
          {/* Botão Fechar Modal */}
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
          >
            <X size={24} />
          </button>

          {/* Imagem Ampliada */}
          <img 
            src={photos[currentIndex]} 
            alt={`Ana Clara e Dener - Foto ${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          />

          {/* Navegação no Modal */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
