import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function Countdown() {
  const weddingDate = new Date('2026-11-28T16:00:00');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +weddingDate - +new Date();
    let time = { dias: 0, horas: 0, minutos: 0, segundos: 0 };

    if (difference > 0) {
      time = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }
    return time;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      style={{
        padding: '48px 0',
        backgroundColor: '#FAF6F0',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: 'var(--color-nude-rosado)',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          <Clock size={14} color="var(--color-nude-rosado)" />
          CONTAGEM REGRESSIVA PARA O GRANDE DIA
        </div>

        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          color: 'var(--color-marrom)',
          marginBottom: '24px'
        }}>
          28 de Novembro de 2026
        </h3>

        {/* Contagem Regressiva Separada e Destaque */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          {[
            { label: 'DIAS', value: timeLeft.dias },
            { label: 'HORAS', value: timeLeft.horas },
            { label: 'MINUTOS', value: timeLeft.minutos },
            { label: 'SEGUNDOS', value: timeLeft.segundos }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{
                padding: '20px 12px',
                textAlign: 'center',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 600,
                color: 'var(--color-marrom)',
                lineHeight: 1
              }}>
                {String(item.value).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--text-subtle)',
                marginTop: '8px'
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
