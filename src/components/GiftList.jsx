import React, { useState, useMemo } from 'react';
import { Gift, Sparkles, ArrowRight, Check, Heart, SlidersHorizontal } from 'lucide-react';
import { INITIAL_GIFTS } from '../data/giftsData';

export default function GiftList({ onSelectGift }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('recommended');
  const [customAmount, setCustomAmount] = useState('');

  const categories = ['Todos', 'Mesa & Cozinha', 'Sala & Receber', 'Casa & Bem-Estar', 'Lua de Mel'];

  // Contagem de presentes por categoria
  const counts = useMemo(() => {
    const map = { 'Todos': INITIAL_GIFTS.length };
    categories.forEach(cat => {
      if (cat !== 'Todos') {
        map[cat] = INITIAL_GIFTS.filter(g => g.category === cat).length;
      }
    });
    return map;
  }, []);

  // Filtragem e ordenação
  const filteredAndSortedGifts = useMemo(() => {
    let list = activeCategory === 'Todos'
      ? [...INITIAL_GIFTS]
      : INITIAL_GIFTS.filter(g => g.category === activeCategory);

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      // Recomendados: featured primeiro
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [activeCategory, sortBy]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!val || val <= 0) return;

    onSelectGift({
      id: 'custom',
      title: 'Cota de Presente Livre',
      price: val,
      category: 'Livre',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1080&q=80',
      description: 'Contribuição com valor livre com todo carinho para abençoar os noivos.'
    });
  };

  const handleQuickAmount = (val) => {
    setCustomAmount(val.toString());
    onSelectGift({
      id: 'custom',
      title: `Cota de Carinho (R$ ${val})`,
      price: val,
      category: 'Livre',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1080&q=80',
      description: 'Contribuição especial para a nova vida de Ana Clara & Dener.'
    });
  };

  return (
    <section id="presentes" style={{ padding: '96px 0 80px', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        
        {/* Cabeçalho Elegante e Poético */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <div style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--color-verde-oliva)',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            — Lista de presentes
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 38px)',
            color: 'var(--color-marrom)',
            margin: '0 0 6px 0',
            fontWeight: 400
          }}>
            Para nossa casa & lua de mel
          </h2>

          <div style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(32px, 5vw, 44px)',
            color: 'var(--color-accent)',
            lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            um lar construído com amor
          </div>

          <p style={{
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'var(--text-muted)',
            margin: '0 auto'
          }}>
            Nossa maior alegria é celebrar esse momento ao lado de quem amamos. Se desejar nos presentear, preparamos uma seleção de itens que farão parte do nosso novo lar e da nossa história.
          </p>
        </div>

        {/* Barra de Filtros e Ordenação */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '36px',
          paddingBottom: '16px',
          borderBottom: '1px solid #EAE0D5'
        }}>
          {/* Pílulas de Categoria com Contador */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '24px',
                    border: isActive ? '1.5px solid var(--color-marrom)' : '1px solid #D9CFC4',
                    backgroundColor: isActive ? 'var(--color-marrom)' : '#FFF',
                    color: isActive ? '#FFF' : 'var(--color-marrom)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat}</span>
                  <span style={{
                    fontSize: '11px',
                    opacity: isActive ? 0.9 : 0.6
                  }}>
                    · {counts[cat]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ordenação */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={14} color="var(--color-marrom)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #D9CFC4',
                backgroundColor: '#FFF',
                color: 'var(--color-marrom)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="recommended">Recomendados</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>

        {/* Grid de Presentes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px',
          marginBottom: '56px'
        }}>
          {filteredAndSortedGifts.map((gift) => (
            <div
              key={gift.id}
              style={{
                backgroundColor: '#FFF',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #EFE6DC',
                boxShadow: '0 4px 16px rgba(116, 93, 87, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(116, 93, 87, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(116, 93, 87, 0.04)';
              }}
            >
              <div>
                {/* Foto com proporção estética */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '210px',
                  overflow: 'hidden',
                  backgroundColor: '#F0EAE1'
                }}>
                  <img
                    src={gift.image}
                    alt={gift.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  {gift.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(4px)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-marrom)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      letterSpacing: '0.05em'
                    }}>
                      ✨ Destaque
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--color-verde-oliva)',
                    letterSpacing: '0.04em'
                  }}>
                    {gift.category}
                  </div>
                </div>

                {/* Conteúdo Descritivo */}
                <div style={{ padding: '20px 20px 12px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    color: 'var(--color-marrom)',
                    margin: '0 0 6px 0',
                    lineHeight: 1.3
                  }}>
                    {gift.title}
                  </h3>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    margin: 0
                  }}>
                    {gift.description}
                  </p>
                </div>
              </div>

              {/* Rodapé com Preço e Botão Presentear */}
              <div style={{
                padding: '14px 20px 20px',
                borderTop: '1px solid #F5EEE6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-subtle)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Valor
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--color-marrom)'
                  }}>
                    R$ {gift.price.toFixed(2).replace('.', ',')}
                  </div>
                  {gift.suggestedInstallments > 1 && (
                    <div style={{ fontSize: '10px', color: 'var(--color-verde-oliva)', fontWeight: 600 }}>
                      até {gift.suggestedInstallments}x de R$ {(gift.price / gift.suggestedInstallments).toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onSelectGift(gift)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'var(--color-marrom)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(116, 93, 87, 0.15)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5c4843'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-marrom)'}
                >
                  Presentear <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bloco Exclusivo de Cota com Valor Livre */}
        <div style={{
          backgroundColor: '#FFF',
          border: '1.5px dashed #D9CFC4',
          borderRadius: '20px',
          padding: '36px 24px',
          maxWidth: '640px',
          margin: '0 auto',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(116, 93, 87, 0.04)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(217, 167, 176, 0.15)',
            marginBottom: '14px'
          }}>
            <Heart size={22} color="var(--color-accent)" />
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            color: 'var(--color-marrom)',
            margin: '0 0 6px 0'
          }}>
            Deseja contribuir com outro valor?
          </h3>

          <p style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            maxWidth: '480px',
            margin: '0 auto 20px'
          }}>
            Você pode escolher qualquer valor que desejar para nos abençoar nessa nova jornada.
          </p>

          {/* Atalhos Rápidos de Valores */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '18px'
          }}>
            {[100, 200, 300, 500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: '1px solid #D9CFC4',
                  backgroundColor: '#FAF6F0',
                  color: 'var(--color-marrom)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-marrom)';
                  e.currentTarget.style.color = '#FFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF6F0';
                  e.currentTarget.style.color = 'var(--color-marrom)';
                }}
              >
                R$ {val}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomSubmit} style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '440px',
            margin: '0 auto'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-marrom)',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                R$
              </span>
              <input
                type="number"
                step="10"
                min="10"
                placeholder="Valor personalizado"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #D9CFC4',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--color-accent)',
                color: '#FFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Presentear
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
