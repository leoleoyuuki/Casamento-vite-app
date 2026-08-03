import React from 'react';
import { Shirt, Sparkles, AlertCircle } from 'lucide-react';

export default function DressCode() {
  return (
    <section id="dress-code" style={{ padding: '100px 0', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        
        {/* Cabeçalho */}
        <div className="section-header">
          <span className="section-subtitle">GUIA DE ESTILO</span>
          <h2 className="section-title">Dress Code: Esporte Fino</h2>
          <div className="section-divider">
            <Shirt size={16} color="var(--color-nude-rosado)" />
          </div>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--color-marrom)', marginBottom: '16px', lineHeight: 1.5 }}>
              "Queremos que vocês estejam elegantes, mas, acima de tudo, confortáveis para celebrar esse dia tão especial ao nosso lado."
            </p>
            
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '24px' }}>
              Sugerimos o traje <strong>Esporte Fino</strong>, ideal para um casamento diurno ao ar livre.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', textAlign: 'left', marginTop: '32px' }}>
              
              {/* Para os Homens */}
              <div style={{ padding: '24px', backgroundColor: '#FAF6F0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '18px', color: 'var(--color-marrom)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--color-verde-oliva)" /> Para os Homens
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Camisas sociais, calças de alfaiataria ou sarja e blazer. A gravata é opcional para manter a leveza do dia.
                </p>
              </div>

              {/* Para as Mulheres */}
              <div style={{ padding: '24px', backgroundColor: '#FAF6F0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '18px', color: 'var(--color-marrom)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--color-nude-rosado)" /> Para as Mulheres
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
              backgroundColor: 'rgba(217, 167, 176, 0.18)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-nude-rosado)',
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

          {/* Paleta de Cores de Inspiração */}
          <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Paleta de Inspiração dos Noivos
            </span>
            
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
              {[
                { name: 'Marrom Atemporal', hex: '#745D57' },
                { name: 'Rosa Claro', hex: '#D9A7B0' },
                { name: 'Nude Rosado', hex: '#C88F98' },
                { name: 'Verde Sálvia', hex: '#A9B39A' },
                { name: 'Verde Oliva', hex: '#7F8F6A' },
                { name: 'Bege Suave', hex: '#E8DDCF' },
              ].map((color, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    border: '2px solid #FFF'
                  }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{color.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
