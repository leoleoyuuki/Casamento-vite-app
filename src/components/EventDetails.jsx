import React from 'react';
import { MapPin, Navigation, Clock, Calendar, ExternalLink } from 'lucide-react';

export default function EventDetails() {
  const mapsUrl = "https://maps.app.goo.gl/asWzc8dHmizWayD88?g_st=iw";
  const wazeUrl = "https://waze.com/ul?q=Sitio%20Sao%20Jorge%20Jardim%20Secreto%20Sao%20Bernardo%20do%20Campo";

  return (
    <section id="local" style={{ padding: '100px 0', backgroundColor: '#FAF6F0', position: 'relative', overflow: 'hidden' }}>
      {/* Elemento Gráfico Floral de Enfeite */}
      <img 
        src="/assets/flor2.png" 
        alt="" 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-25px',
          width: '170px',
          height: 'auto',
          opacity: 0.28,
          pointerEvents: 'none',
          transform: 'rotate(15deg)',
          zIndex: 1
        }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Cabeçalho da Seção */}
        <div className="section-header">
          <span className="section-subtitle">CERIMÔNIA & CELEBRAÇÃO</span>
          <h2 className="section-title">O Nosso Lugar Secreto</h2>
          <div className="section-divider">
            <MapPin size={16} color="var(--color-verde-oliva)" />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'stretch'
        }}>

          {/* Card com Texto & Detalhes */}
          <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'rgba(127, 143, 106, 0.15)', color: 'var(--color-verde-oliva)', borderRadius: '999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '20px' }}>
                <Calendar size={14} /> 28 DE NOVEMBRO DE 2026
              </div>

              <h3 style={{ fontSize: '32px', color: 'var(--color-marrom)', marginBottom: '16px' }}>
                Sítio São Jorge · Espaço Jardim Secreto
              </h3>

              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: 1.6, color: 'var(--text-dark)', marginBottom: '16px' }}>
                "Escolher o lugar onde celebraríamos esse dia foi uma das decisões mais especiais do nosso casamento. Queríamos um lugar que refletisse quem somos, onde pudéssemos viver cada momento com leveza e receber com carinho todas as pessoas que amamos."
              </p>

              <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '20px' }}>
                O <strong>Jardim Secreto</strong> representa exatamente aquilo que o Senhor preparou para nós, primeiro em nossos corações e, agora, em um lugar onde diremos o segundo "sim" mais importante das nossas vidas.
              </p>

              <div style={{ padding: '16px', backgroundColor: '#FAF6F0', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={20} color="var(--color-marrom)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--color-marrom)', fontSize: '15px' }}>Endereço Completo:</strong>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Rua Araribás, 25 · Anchieta, São Bernardo do Campo - SP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '160px', padding: '14px 20px', fontSize: '13px' }}
              >
                <Navigation size={16} /> Abrir no Google Maps <ExternalLink size={14} />
              </a>
              <a 
                href={wazeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-sage"
                style={{ flex: 1, minWidth: '140px', padding: '14px 20px', fontSize: '13px' }}
              >
                Abrir no Waze <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Card com Foto do Local & Mapa Embed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ overflow: 'hidden', height: '240px' }}>
              <img 
                src="/assets/00003028-PHOTO-2026-08-02-17-36-05.jpg" 
                alt="Sítio São Jorge Espaço Jardim Secreto" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div className="glass-card" style={{ overflow: 'hidden', flex: 1, minHeight: '260px', borderRadius: 'var(--radius-md)' }}>
              <iframe
                title="Mapa do Sítio São Jorge"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '260px' }}
                loading="lazy"
                allowFullScreen
                src="https://maps.google.com/maps?q=Rua%20Araribas%2025%20Sao%20Bernardo%20do%20Campo&t=&z=15&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
