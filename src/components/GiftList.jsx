import React, { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { INITIAL_GIFTS } from '../data/giftsData';

export default function GiftList({ onSelectGift }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [customAmount, setCustomAmount] = useState('');

  const categories = ['Todos', 'Lua de Mel', 'Experiências', 'Casa Nova', 'Eletro'];

  const filteredGifts = activeCategory === 'Todos' 
    ? INITIAL_GIFTS 
    : INITIAL_GIFTS.filter(g => g.category === activeCategory);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!val || val <= 0) return;

    onSelectGift({
      id: 'custom',
      title: 'Cota de Presente Livre',
      price: val,
      category: 'Livre',
      image: '/assets/00003019-PHOTO-2026-08-02-17-34-56.jpg',
      description: 'Contribuição com valor livre para abençoar o casal.'
    });
  };

  return (
    <section id="presentes" style={{ padding: '88px 0', backgroundColor: '#F3ECE2' }}>
      <div className="container">
        
        {/* Cabeçalho */}
        <div className="section-header">
          <span className="section-subtitle">LISTA DE PRESENTES VIRTUAL</span>
          <h2 className="section-title">Abençoe a Nossa Nova Vida</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Cada presente simboliza uma cota de carinho e nos ajudará a montar a nossa casa nova e a viver a lua de mel dos sonhos.
          </p>
          <div className="section-divider">
            <Gift size={14} color="var(--color-marrom)" />
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '36px' }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'btn btn-primary' : 'btn btn-outline'}
              style={{
                padding: '8px 18px',
                fontSize: '12px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Presentes Limpo e Preciso */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {filteredGifts.map((gift) => (
            <div 
              key={gift.id} 
              className="glass-card"
              style={{
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <div>
                {/* Imagem do Presente */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={gift.image} 
                    alt={gift.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid var(--border-subtle)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--color-marrom)'
                  }}>
                    {gift.category}
                  </div>
                </div>

                {/* Conteúdo */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-marrom)', marginBottom: '6px' }}>
                    {gift.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {gift.description}
                  </p>
                </div>
              </div>

              {/* Rodapé do Card */}
              <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>Valor do Presente</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--color-marrom)' }}>
                    R$ {gift.price.toFixed(2)}
                  </div>
                  {gift.suggestedInstallments > 1 && (
                    <div style={{ fontSize: '10px', color: 'var(--color-verde-oliva)', fontWeight: 600 }}>
                      até {gift.suggestedInstallments}x de R$ {(gift.price / gift.suggestedInstallments).toFixed(2)}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onSelectGift(gift)} 
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  <Gift size={14} /> Presentear
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Card para Cota Livre */}
        <div className="glass-card" style={{ maxWidth: '580px', margin: '0 auto', padding: '32px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'inline-flex', padding: '10px', backgroundColor: 'rgba(217, 167, 176, 0.15)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
            <Sparkles size={20} color="var(--color-marrom)" />
          </div>
          <h3 style={{ fontSize: '22px', color: 'var(--color-marrom)', marginBottom: '6px' }}>
            Prefere dar outro valor?
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Digite qualquer valor livre que desejar para abençoar a união do casal.
          </p>

          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', fontWeight: 600, fontSize: '14px' }}>
                R$
              </span>
              <input 
                type="number" 
                step="10" 
                min="10" 
                placeholder="100,00" 
                value={customAmount} 
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn btn-sage" style={{ padding: '10px 22px' }}>
              Presentear com Valor Livre
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
