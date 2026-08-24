import React, { useState, useEffect } from 'react';
import { CheckCircle, KeyRound, Users, Heart, Sparkles, Check, Loader2 } from 'lucide-react';
import { GUEST_LIST } from '../data/rsvpsData';

export default function RSVP() {
  const [guestCode, setGuestCode] = useState('');
  const [activeGuest, setActiveGuest] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [mainName, setMainName] = useState('');
  const [totalGuests, setTotalGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Leitura Automática de Parâmetros na URL (?convite=XXXX ou ?code=XXXX)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      // Suporte também a parâmetros dentro do hash (ex: /#rsvp?convite=XXXX)
      let hashParams = new URLSearchParams();
      if (window.location.hash && window.location.hash.includes('?')) {
        hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
      }

      const paramCode = searchParams.get('convite') || 
                        searchParams.get('code') || 
                        searchParams.get('c') || 
                        searchParams.get('rsvp') ||
                        hashParams.get('convite') ||
                        hashParams.get('code') ||
                        hashParams.get('c');

      if (paramCode) {
        const cleanCode = paramCode.trim().toUpperCase();
        setGuestCode(cleanCode);
        validateCode(cleanCode, true);
      }
    } catch (e) {
      console.warn('Erro ao processar parâmetro de URL:', e);
    }
  }, []);

  const validateCode = async (codeToVerify, fromUrl = false) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsValidating(true);

    const cleanCode = codeToVerify.trim().toUpperCase();

    try {
      const res = await fetch('/api/rsvp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode })
      });
      const data = await res.json();
      setIsValidating(false);

      if (data.success) {
        setActiveGuest(data.guest);
        setMainName(data.guest.name);
        setTotalGuests(1);

        if (fromUrl) {
          setTimeout(() => {
            const rsvpElement = document.getElementById('rsvp');
            if (rsvpElement) {
              rsvpElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      } else {
        setErrorMsg(data.message || 'Código não encontrado na lista fechada. Verifique seu convite ou digite o código correto.');
      }
    } catch (err) {
      setIsValidating(false);
      setErrorMsg('Erro de comunicação com o servidor. Tente novamente.');
    }
  };

  const handleValidateCode = async (e) => {
    e.preventDefault();
    if (!guestCode.trim()) return;
    validateCode(guestCode, false);
  };

  const handleConfirmRsvp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeGuest.code,
          guestName: mainName,
          totalGuests,
          message: notes
        })
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setSuccessMsg(data.message);
      } else {
        setErrorMsg(data.message || 'Erro ao confirmar presença.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Erro de conexão ao enviar confirmação.');
    }
  };

  return (
    <section id="rsvp" style={{ padding: '100px 0', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        
        {/* Cabeçalho */}
        <div className="section-header">
          <span className="section-subtitle">CONFIRMAÇÃO DE PRESENÇA</span>
          <h2 className="section-title">Confirme Sua Presença (RSVP)</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            A confirmação de presença é fundamental para a organização do nosso casamento. Insira o código exclusivo do seu convite abaixo.
          </p>
          <div className="section-divider">
            <CheckCircle size={16} color="var(--color-verde-oliva)" />
          </div>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Card Principal */}
          <div className="glass-card" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            
            {successMsg ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'rgba(169, 179, 154, 0.2)', borderRadius: '50%', marginBottom: '16px' }}>
                  <Check size={40} color="var(--color-verde-oliva)" />
                </div>
                <h3 style={{ fontSize: '26px', color: 'var(--color-marrom)', marginBottom: '8px' }}>
                  Presença Confirmada!
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {successMsg}
                </p>
                <button 
                  onClick={() => { setActiveGuest(null); setSuccessMsg(null); setGuestCode(''); }} 
                  className="btn btn-outline"
                >
                  Confirmar para Outro Convite
                </button>
              </div>
            ) : !activeGuest ? (
              
              /* Passo 1: Digitar Código */
              <form onSubmit={handleValidateCode}>
                <div style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyRound size={16} /> Digite o Código Único do Seu Convite:
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Ex: 26SL87 ou FLSPCE" 
                    value={guestCode} 
                    onChange={(e) => setGuestCode(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-full)',
                      border: '1.5px solid var(--border-light)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '15px',
                      textTransform: 'uppercase',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px', display: 'flex', gap: '8px', alignItems: 'center' }} disabled={isValidating}>
                    {isValidating ? 'Validando...' : 'Validar Convite'} <CheckCircle size={18} />
                  </button>
                </div>

                {errorMsg && (
                  <p style={{ color: '#9B1C1C', fontSize: '13px', marginTop: '14px' }}>{errorMsg}</p>
                )}

                <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: 'rgba(232, 221, 207, 0.4)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  💡 Cada convite possui um <strong>código alfanumérico exclusivo</strong> de 6 caracteres enviado pelos noivos.
                </div>
              </form>
            ) : (
              
              /* Passo 2: Formulário de Confirmação */
              <form onSubmit={handleConfirmRsvp}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-verde-oliva)', textTransform: 'uppercase' }}>Convite Validado</span>
                    <h4 style={{ fontSize: '20px', color: 'var(--color-marrom)' }}>{activeGuest.name}</h4>
                  </div>
                  <button type="button" onClick={() => setActiveGuest(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                    Trocar código
                  </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                    Nome do Convidado Principal:
                  </label>
                  <input 
                    type="text" 
                    value={mainName} 
                    onChange={(e) => setMainName(e.target.value)} 
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '14px' }} 
                  />
                </div>

                {/* Campo de quantidade de acompanhantes removido conforme solicitado pelos noivos. O convite é individual e intransferível. */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                    Alguma observação ou restrição alimentar? (Opcional):
                  </label>
                  <textarea 
                    rows="3" 
                    placeholder="Ex: Vegetariano, intolerância a glúten..." 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '14px' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '16px', fontSize: '15px' }}
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar Presença no Casamento'}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
