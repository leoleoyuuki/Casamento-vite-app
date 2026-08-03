import React, { useState } from 'react';
import { Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="historia" style={{ padding: '88px 0', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        
        {/* Cabeçalho */}
        <div className="section-header">
          <span className="section-subtitle">SEJA BEM-VINDO AO NOSSO ESPAÇO</span>
          <h2 className="section-title">Nossa História & Boas-Vindas</h2>
          <div className="section-divider">
            <Heart size={14} color="var(--color-nude-rosado)" />
          </div>
        </div>

        {/* Grid 2 Colunas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>

          {/* Galeria de Fotos */}
          <div>
            <div 
              className="glass-card" 
              style={{
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                aspectRatio: '4/5',
                marginBottom: '12px',
                position: 'relative'
              }}
            >
              <img 
                src={photos[currentIndex]} 
                alt={`Ana Clara e Dener - Foto ${currentIndex + 1}`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.3s ease'
                }}
              />

              {/* Botões de Navegação */}
              <button
                onClick={handlePrev}
                aria-label="Foto anterior"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-marrom)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                aria-label="Próxima foto"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-marrom)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Legenda dos Noivos */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 20px',
                background: 'linear-gradient(0deg, rgba(44, 34, 30, 0.75) 0%, transparent 100%)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span className="font-script" style={{ fontSize: '26px' }}>
                  Ana Clara & Dener
                </span>
                <span style={{ fontSize: '11px', opacity: 0.9, fontWeight: 500 }}>
                  {currentIndex + 1} / {photos.length}
                </span>
              </div>
            </div>

            {/* Thumbnails sem scrollbar */}
            <div 
              style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              {photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ver foto ${idx + 1}`}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: currentIndex === idx ? '2px solid var(--color-marrom)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    opacity: currentIndex === idx ? 1 : 0.6,
                    transition: 'var(--transition-fast)',
                    flexShrink: 0,
                    padding: 0
                  }}
                >
                  <img 
                    src={photo} 
                    alt={`Miniatura ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Carta dos Noivos */}
          <div className="glass-card" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-verde-oliva)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>
              <Sparkles size={14} /> MENSAGEM DOS NOIVOS
            </div>

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
              backgroundColor: 'rgba(217, 167, 176, 0.12)',
              borderLeft: '3px solid var(--color-nude-rosado)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-marrom)' }}>
                ✨ <strong>Ah, não se esqueçam de confirmar sua presença!</strong> Essa parte é muito importante para nós!
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
    </section>
  );
}
