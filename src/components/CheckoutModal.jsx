import React, { useState } from 'react';
import { X, QrCode, CreditCard, Copy, Check, Lock, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';

export default function CheckoutModal({ gift, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState('hosted'); // 'hosted' | 'pix'
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCpf, setGuestCpf] = useState('');

  // Máscara amigável de telefone / WhatsApp (11) 98765-4321
  const formatPhone = (val) => {
    let clean = val.replace(/\D/g, '').slice(0, 11);
    if (clean.length > 10) {
      return clean.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (clean.length > 6) {
      return clean.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (clean.length > 2) {
      return clean.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    return clean;
  };

  if (!gift) return null;

  // Processar Checkout Hospedado Oficial do Asaas (Cartão 12x ou PIX na tela Asaas)
  const handleOpenAsaasHostedCheckout = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Por favor, informe seu nome para os noivos saberem quem presenteou!');
      return;
    }

    if (!guestPhone || guestPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe seu WhatsApp com DDD para que os noivos possam enviar o agradecimento!');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/asaas/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftTitle: gift.title,
          amount: gift.price,
          guestName,
          guestPhone,
          guestCpf
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.invoiceUrl) {
        // Redireciona diretamente para a tela oficial segura do Asaas
        window.open(data.invoiceUrl, '_blank');
        setSuccessData({
          type: 'hosted',
          invoiceUrl: data.invoiceUrl,
          message: 'Abrimos o Checkout Seguro do Asaas para você concluir seu presente com total privacidade!'
        });
      } else {
        setErrorMsg(data.message || 'Erro ao conectar ao checkout do Asaas.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Falha de comunicação com o servidor.');
    }
  };

  // Processar PIX Direto no Modal via API Asaas
  const handleGeneratePix = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Por favor, informe seu nome para os noivos saberem quem presenteou!');
      return;
    }

    if (!guestPhone || guestPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe seu WhatsApp com DDD para que os noivos possam enviar o agradecimento!');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/asaas/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftTitle: gift.title,
          amount: gift.price,
          guestName,
          guestPhone,
          guestCpf
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccessData({
          type: 'pix',
          qrCodeImage: data.qrCodeImage,
          copyAndPaste: data.copyAndPaste,
          expirationDate: data.expirationDate
        });
      } else {
        setErrorMsg(data.message || 'Erro ao gerar PIX.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Falha de comunicação com o servidor.');
    }
  };

  const handleCopyPix = () => {
    if (successData?.copyAndPaste) {
      navigator.clipboard.writeText(successData.copyAndPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(58, 47, 44, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        position: 'relative',
        backgroundColor: '#FAF6F0'
      }}>
        
        {/* Fechar Modal */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {/* Cabeçalho do Modal */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--color-nude-rosado)', textTransform: 'uppercase' }}>
            CHECKOUT SEGURO · ASAAS
          </span>
          <h3 style={{ fontSize: '26px', color: 'var(--color-marrom)', marginTop: '4px' }}>
            Presentear o Casal
          </h3>
        </div>

        {/* Resumo do Presente Selecionado */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          backgroundColor: '#FFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          marginBottom: '24px'
        }}>
          <img 
            src={gift.image} 
            alt={gift.title} 
            style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
          />
          <div style={{ flex: 1 }}>
            <strong style={{ color: 'var(--color-marrom)', fontSize: '16px' }}>{gift.title}</strong>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{gift.category}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--color-marrom)' }}>
              R$ {gift.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Tela de Sucesso */}
        {successData ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {successData.type === 'hosted' ? (
              <div>
                <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'rgba(169, 179, 154, 0.2)', borderRadius: '50%', marginBottom: '16px' }}>
                  <ShieldCheck size={40} color="var(--color-verde-oliva)" />
                </div>
                <h4 style={{ fontSize: '22px', color: 'var(--color-marrom)', marginBottom: '8px' }}>
                  Checkout Seguro Aberto!
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                  {successData.message}
                </p>

                {successData.invoiceUrl && (
                  <a 
                    href={successData.invoiceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <ExternalLink size={18} /> Reabrir Página de Pagamento Asaas
                  </a>
                )}

                <button onClick={onClose} className="btn btn-outline" style={{ width: '100%', padding: '12px' }}>
                  Concluir e Fechar
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'rgba(169, 179, 154, 0.2)', borderRadius: '50%', marginBottom: '16px' }}>
                  <QrCode size={32} color="var(--color-verde-oliva)" />
                </div>
                <h4 style={{ fontSize: '20px', color: 'var(--color-marrom)', marginBottom: '8px' }}>
                  QR Code PIX Gerado!
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Escaneie o código abaixo com o aplicativo do seu banco ou copie o código PIX:
                </p>

                {/* QR Code Imagem */}
                {successData.qrCodeImage && (
                  <div style={{ margin: '0 auto 20px', padding: '16px', backgroundColor: '#FFF', width: '200px', height: '200px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <img src={successData.qrCodeImage} alt="QR Code PIX Asaas" style={{ width: '100%', height: '100%' }} />
                  </div>
                )}

                {/* Botão Copia e Cola */}
                <button 
                  onClick={handleCopyPix}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', marginBottom: '16px' }}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />} 
                  {copied ? 'Código PIX Copiado!' : 'Copiar Código PIX (Copia e Cola)'}
                </button>

                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Após realizar o pagamento, a confirmação é automática e o valor vai direto para os noivos.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Formulário de Checkout */
          <div>
            {/* Mensagem de Erro */}
            {errorMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: '#FDE8E8', color: '#9B1C1C', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            )}

            {/* Alternar Método de Pagamento */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('hosted')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'hosted' ? '2px solid var(--color-marrom)' : '1px solid var(--border-light)',
                  backgroundColor: paymentMethod === 'hosted' ? '#FFF' : 'transparent',
                  color: 'var(--color-marrom)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ShieldCheck size={18} color="var(--color-verde-oliva)" /> Checkout Seguro Asaas
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'pix' ? '2px solid var(--color-marrom)' : '1px solid var(--border-light)',
                  backgroundColor: paymentMethod === 'pix' ? '#FFF' : 'transparent',
                  color: 'var(--color-marrom)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <QrCode size={18} /> PIX Direto
              </button>
            </div>

            {/* Formulário Dados do Convidado */}
            <form onSubmit={paymentMethod === 'hosted' ? handleOpenAsaasHostedCheckout : handleGeneratePix}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                  Seu Nome Completo (para os noivos identificarem o presente): *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Leonardo Yuuki" 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                    WhatsApp com DDD: *
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="(11) 98765-4321" 
                    value={guestPhone} 
                    onChange={(e) => setGuestPhone(formatPhone(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                  <small style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Para os noivos enviarem o agradecimento 🤍
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                    CPF (opcional):
                  </label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00" 
                    value={guestCpf} 
                    onChange={(e) => setGuestCpf(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                  <small style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Para emissão do comprovante Asaas
                  </small>
                </div>
              </div>

              {/* Botão de Ação */}
              {paymentMethod === 'hosted' ? (
                <div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {loading ? <Loader2 size={18} className="spin" /> : <Lock size={18} />}
                    Ir para o Checkout Seguro Asaas (PIX ou Até 12x)
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                    <ShieldCheck size={14} color="var(--color-verde-oliva)" />
                    Ambiente 100% Criptografado com Garantia Asaas (PCI Nível 1)
                  </div>
                </div>
              ) : (
                <div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {loading ? <Loader2 size={18} className="spin" /> : <QrCode size={18} />}
                    Gerar Código PIX do Presente
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                    <Lock size={14} /> Pagamento instantâneo direto no aplicativo do seu banco
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
