import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Heart, User, Calendar } from 'lucide-react';
import { INITIAL_MESSAGES } from '../data/messagesData';

export default function MessageBoard() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [author, setAuthor] = useState('');
  const [relationship, setRelationship] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(err => console.error('Erro ao buscar mensagens:', err));
  }, []);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!author || !text) return;

    setLoading(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, relationship, text })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessages([data.message, ...messages]);
        setAuthor('');
        setRelationship('');
        setText('');
        setSuccessMsg('Sua mensagem foi publicada no mural dos noivos!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <section id="recados" style={{ padding: '100px 0', backgroundColor: '#F3ECE2' }}>
      <div className="container">
        
        {/* Cabeçalho */}
        <div className="section-header">
          <span className="section-subtitle">MURAL DE CARINHO</span>
          <h2 className="section-title">Deixe Seu Recado aos Noivos</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            Escreva uma mensagem especial para a Ana Clara e o Dener guardarem para sempre no coração.
          </p>
          <div className="section-divider">
            <MessageSquare size={16} color="var(--color-nude-rosado)" />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>

          {/* Formulário de Envio */}
          <div className="glass-card" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '22px', color: 'var(--color-marrom)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} color="var(--color-nude-rosado)" /> Escrever Mensagem
            </h3>

            {successMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(169, 179, 154, 0.2)', color: 'var(--color-verde-oliva)', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmitMessage}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '4px' }}>
                  Seu Nome:
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Tio João & Família" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '14px' }} 
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '4px' }}>
                  Relação com os Noivos (Opcional):
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Padrinhos, Amigos da Faculdade, Família" 
                  value={relationship} 
                  onChange={(e) => setRelationship(e.target.value)} 
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '14px' }} 
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '4px' }}>
                  Sua Mensagem:
                </label>
                <textarea 
                  rows="4" 
                  placeholder="Escreva aqui seus votos de felicidades ao casal..." 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '14px' }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px' }}
              >
                {loading ? 'Enviando...' : 'Publicar no Mural'}
              </button>
            </form>
          </div>

          {/* Mural de Mensagens Publicadas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '520px', overflowY: 'auto', paddingRight: '8px' }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className="glass-card" 
                style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFF' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '16px', color: 'var(--color-marrom)' }}>{msg.author}</strong>
                    {msg.relationship && (
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-verde-oliva)', fontWeight: 600 }}>
                        {msg.relationship}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{msg.date}</span>
                </div>

                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--text-dark)', lineHeight: 1.6 }}>
                  "{msg.text}"
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
