import React from 'react';
import { Shirt, Sparkles, AlertCircle } from 'lucide-react';

export default function DressCode() {
  return (
    <section 
      id="dress-code" 
      style={{ 
        position: 'relative',
        padding: '100px 0', 
        backgroundColor: '#FAF6F0',
        overflow: 'hidden'
      }}
    >
      {/* Fade suave na transição superior com a seção EventDetails */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(180deg, #FAF6F0 0%, rgba(250, 246, 240, 0) 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} 
      />

      {/* Elemento Gráfico Floral de Enfeite */}
      <img 
        src="/assets/flor1.png" 
        alt="" 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-65px',
          right: '-25px',
          width: '190px',
          height: 'auto',
          opacity: 0.28,
          pointerEvents: 'none',
          transform: 'rotate(10deg)',
          zIndex: 2
        }}
      />

      {/* Background Image como Marca d'Água Suave e Elegante */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/testebanner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) sepia(25%) brightness(1.08) contrast(90%)',
          opacity: 0.12,
          pointerEvents: 'none'
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Cabeçalho no padrão original do site */}
        <div className="section-header">
          <span className="section-subtitle">GUIA DE ESTILO</span>
          <h2 className="section-title">Dress Code: Esporte Fino</h2>
          <div className="section-divider">
            <Shirt size={16} color="var(--color-marrom)" />
          </div>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Card Principal no padrão original glass-card claro */}
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--color-marrom)', marginBottom: '16px', lineHeight: 1.5 }}>
              "Queremos que vocês estejam elegantes, mas, acima de tudo, confortáveis para celebrar esse dia tão especial ao nosso lado."
            </p>
            
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '24px' }}>
              Sugerimos o traje <strong>Esporte Fino</strong>, ideal para a nossa celebração diurna.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', textAlign: 'left', marginTop: '32px' }}>
              
              {/* Para os Homens */}
              <div style={{ padding: '24px', backgroundColor: '#FAF6F0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '18px', color: 'var(--color-marrom)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--color-verde-oliva)" /> Para os Homens
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Camisas sociais, calças de alfaiataria ou sarja e blazer. A gravata é opcional para manter a leveza do dia.
                </p>
              </div>

              {/* Para as Mulheres */}
              <div style={{ padding: '24px', backgroundColor: '#FAF6F0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '18px', color: 'var(--color-marrom)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--color-marrom)" /> Para as Mulheres
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Vestidos midi ou longos em tecidos leves e fluídos, macacões sofisticados ou conjuntos elegantes.
                </p>
              </div>

            </div>

            {/* Aviso sobre cor branca */}
            <div style={{
              marginTop: '32px',
              padding: '16px 24px',
              backgroundColor: 'rgba(116, 93, 87, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-marrom)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <AlertCircle size={20} color="var(--color-marrom)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: 'var(--color-marrom)', fontWeight: 500 }}>
                Pedimos, com carinho, que as convidadas evitem a cor <strong>branca ou off-white</strong>, reservada para a noiva. 🤍
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
