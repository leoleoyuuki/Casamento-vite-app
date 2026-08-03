import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-dark-accent)',
      color: 'var(--text-light)',
      padding: '60px 0 30px',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Monograma */}
        <div style={{ fontFamily: 'var(--font-script)', fontSize: '56px', color: 'var(--color-rosa-claro)', lineHeight: 1, marginBottom: '8px' }}>
          Ana & Dener
        </div>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', opacity: 0.9, marginBottom: '24px' }}>
          28 de Novembro de 2026 · São Bernardo do Campo, SP
        </p>

        {/* Links do Menu */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '36px' }}>
          {[
            { label: 'Início', href: '#inicio' },
            { label: 'Nossa História', href: '#historia' },
            { label: 'Cerimônia', href: '#local' },
            { label: 'Dress Code', href: '#dress-code' },
            { label: 'Presentes', href: '#presentes' },
            { label: 'RSVP', href: '#rsvp' },
            { label: 'Mural de Recados', href: '#recados' }
          ].map((item, idx) => (
            <a 
              key={idx} 
              href={item.href}
              style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '13px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Selo Asaas */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '999px',
          fontSize: '12px',
          color: 'var(--color-bege-claro)',
          marginBottom: '32px'
        }}>
          <ShieldCheck size={16} color="var(--color-verde-salvia)" /> Pagamentos 100% seguros via Asaas API · PIX e Cartão em até 12x
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', fontSize: '12px', opacity: 0.6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <span>© 2026 Ana Clara Allemany & Dener Vilarinho. Todos os direitos reservados.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Feito com <Heart size={12} fill="var(--color-rosa-claro)" color="var(--color-rosa-claro)" /> para esse casal tão especial.
          </span>
        </div>

      </div>
    </footer>
  );
}
