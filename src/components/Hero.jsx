import React from 'react';
import { Calendar, MapPin, Heart, CheckCircle, Gift } from 'lucide-react';

export default function Hero() {
  return (
    <section 
      id="inicio"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 0 0',
        overflow: 'hidden',
        backgroundColor: '#2C221E'
      }}
    >
      {/* Background Image Aquarela em Opacidade Total */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/assets/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 1
      }} />

      {/* Overlay escuro sutil para garantir contraste máximo e legibilidade do texto branco */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(44, 34, 30, 0.45)',
        zIndex: 1
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#FFFFFF' }}>
        


        {/* Nomes dos Noivos em Sloop Script / Script Pro */}
        <h1 style={{
          fontFamily: 'var(--font-script)',
          fontSize: 'clamp(48px, 8vw, 76px)',
          fontWeight: 400,
          color: '#FFFFFF',
          lineHeight: 1.1,
          marginBottom: '16px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          Ana Clara e Dener
        </h1>

        {/* Versículo Bíblico em Serifada Itálica Legível e Proporcional */}
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(16px, 2.2vw, 22px)',
          fontWeight: 400,
          color: '#FFFFFF',
          lineHeight: 1.5,
          maxWidth: '600px',
          margin: '0 auto 28px',
          textShadow: '0 2px 10px rgba(0,0,0,0.85)',
          letterSpacing: '0.01em'
        }}>
          "Acima de tudo, porém, revistam-se do amor, que é o elo da perfeição."
          <span style={{ display: 'block', fontSize: '0.85em', fontStyle: 'normal', fontFamily: 'var(--font-sans)', fontWeight: 600, color: '#FFFFFF', opacity: 1, marginTop: '6px', textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}>
            — Colossenses 3:14
          </span>
        </p>

        {/* Data e Local em branco puro com pesos de fonte equilibrados */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          color: '#FFFFFF',
          fontFamily: 'var(--font-serif)',
          textTransform: 'uppercase',
          marginBottom: '36px',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          flexWrap: 'wrap'
        }}>
          <span style={{ width: '36px', height: '1.5px', backgroundColor: '#FFFFFF', display: 'inline-block', opacity: 0.9 }} />
          <span style={{ fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 600, letterSpacing: '0.2em', color: '#FFFFFF' }}>
            28 · 11 · 2026
          </span>
          <span style={{ color: '#FFFFFF', opacity: 0.8, fontSize: '13px' }}>·</span>
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.2em', color: '#FFFFFF' }}>
            SÃO BERNARDO DO CAMPO, SP
          </span>
          <span style={{ width: '36px', height: '1.5px', backgroundColor: '#FFFFFF', display: 'inline-block', opacity: 0.9 }} />
        </div>

        {/* Botões de Ação Minimalistas e Leves */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <a 
            href="#rsvp" 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px', 
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#FFFFFF', 
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'var(--transition-fast)',
              opacity: 0.9
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.opacity = '0.9'; }}
          >
            <CheckCircle size={14} /> Confirmar Presença
          </a>
          <a 
            href="#presentes" 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px', 
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#FFFFFF', 
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'var(--transition-fast)',
              opacity: 0.85
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.opacity = '0.85'; }}
          >
            <Gift size={14} /> Lista de Presentes
          </a>
        </div>

      </div>

      {/* Faixa de Cores (Bandstripes) com 36 listras finas em tons de verde/marrom/bege e textura aquarela */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '10px',
          overflow: 'hidden',
          zIndex: 10,
          boxShadow: '0 -2px 6px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
          {[
            '#7F8F6A', '#A9B39A', '#5B6849', '#E8DDCF', '#745D57', '#6B7A59', 
            '#93A083', '#485438', '#A9B39A', '#7F8F6A', '#DFD0C0', '#5B6849',
            '#745D57', '#6B7A59', '#A9B39A', '#93A083', '#7F8F6A', '#485438',
            '#E8DDCF', '#5B6849', '#7F8F6A', '#A9B39A', '#745D57', '#6B7A59',
            '#93A083', '#DFD0C0', '#485438', '#7F8F6A', '#A9B39A', '#5B6849',
            '#745D57', '#6B7A59', '#93A083', '#E8DDCF', '#7F8F6A', '#A9B39A'
          ].map((color, idx) => (
            <div 
              key={idx} 
              style={{ 
                flex: 1, 
                backgroundColor: color,
                height: '100%'
              }} 
            />
          ))}
        </div>

        {/* Camada de Textura de Aquarela estilo hero-bg.png */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/assets/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            mixBlendMode: 'overlay',
            opacity: 0.65,
            pointerEvents: 'none'
          }} 
        />
      </div>
    </section>
  );
}
