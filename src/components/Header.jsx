import React, { useState, useEffect } from 'react';
import { Menu, X, CheckCircle } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Nossa História', href: '#historia' },
    { label: 'Cerimônia & Festa', href: '#local' },
    { label: 'Dress Code', href: '#dress-code' },
    { label: 'Presentes', href: '#presentes' },
    { label: 'Mural de Recados', href: '#recados' },
  ];

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'var(--transition-fast)',
        backgroundColor: scrolled ? 'rgba(250, 246, 240, 0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        padding: scrolled ? '10px 0' : '16px 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Monograma / Logo */}
        <a href="#inicio" style={{ textDecoration: 'none', color: scrolled ? 'var(--color-marrom)' : '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-script" style={{ fontSize: '32px', color: scrolled ? 'var(--color-marrom)' : '#FAF6F0', lineHeight: 1 }}>
            A & D
          </span>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '24px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: scrolled ? 'var(--text-dark)' : '#FFFFFF',
                textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.5)',
                textDecoration: 'none',
                transition: 'var(--transition-fast)',
                opacity: 0.95
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = scrolled ? 'var(--color-marrom)' : '#E8DDCF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.95'; e.currentTarget.style.color = scrolled ? 'var(--text-dark)' : '#FFFFFF'; }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA RSVP Desktop Leve & Minimalista */}
        <div style={{ display: 'none', gap: '12px', alignItems: 'center' }} className="desktop-cta">
          <a 
            href="#rsvp" 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 15px', 
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              color: scrolled ? 'var(--color-marrom)' : '#FFFFFF',
              border: scrolled ? '1px solid var(--color-marrom)' : '1px solid rgba(255, 255, 255, 0.45)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition-fast)',
              opacity: 0.95
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = scrolled ? 'rgba(116, 93, 87, 0.08)' : 'rgba(255, 255, 255, 0.15)'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent'; 
            }}
          >
            <CheckCircle size={14} /> Confirmar Presença
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: scrolled ? 'var(--color-marrom)' : '#FFFFFF',
            cursor: 'pointer',
            padding: '6px'
          }}
          className="mobile-toggle"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Drawer Mobile Limpo */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: 'var(--shadow-md)'
        }}>
          {navLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '18px',
                color: 'var(--color-marrom)',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#rsvp" 
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '6px' }}
          >
            <CheckCircle size={15} /> Confirmar Presença
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav, .desktop-cta { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
