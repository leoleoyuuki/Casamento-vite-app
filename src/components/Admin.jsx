import React, { useState, useEffect } from 'react';
import { Lock, LogOut, MessageSquare, Users, Check, X, Shield, EyeOff, Eye, Plus, Upload, Download, FileText, Copy, Sparkles, Smartphone, RefreshCw, Send, Radio, AlertCircle, CheckCircle2, Edit2, Trash2, Search, ExternalLink, Share2, CheckCheck, Loader2 } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'rsvps' | 'gifts'
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Dados
  const [messages, setMessages] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);

  // WhatsApp State
  const [waStatus, setWaStatus] = useState({ status: 'DISCONNECTED', isConnected: false, qrCode: null, user: null });
  const [waLoading, setWaLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testMsg, setTestMsg] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testResponse, setTestResponse] = useState(null);
  const [resendingGiftId, setResendingGiftId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Formulário Individual de Convidados
  const [newGuestCode, setNewGuestCode] = useState('');
  const [newGuestName, setNewGuestName] = useState('');

  // Gerenciamento de Edição e Busca de Convidados
  const [editingGuest, setEditingGuest] = useState(null); // { oldCode, name, newCode }
  const [savingEdit, setSavingEdit] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [searchGuest, setSearchGuest] = useState('');
  const [migrateLoading, setMigrateLoading] = useState(false);

  // Gerador de Convites em Massa (TXT/CSV)
  const [bulkText, setBulkText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [showBulkSection, setShowBulkSection] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setPassword(savedToken);
      setIsAuthenticated(true);
      loadAdminData(savedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        localStorage.setItem('adminToken', password);
        setIsAuthenticated(true);
        loadAdminData(password);
      } else {
        setErrorMsg('Senha incorreta.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Erro ao tentar conectar com o servidor.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setPassword('');
  };

  const loadAdminData = async (token) => {
    try {
      // Buscar Mensagens
      const msgRes = await fetch('/api/admin/messages', {
        headers: { 'Authorization': token }
      });
      const msgData = await msgRes.json();
      if (msgData.success) setMessages(msgData.messages);

      // Buscar RSVPs
      const rsvpRes = await fetch('/api/admin/rsvps', {
        headers: { 'Authorization': token }
      });
      const rsvpData = await rsvpRes.json();
      if (rsvpData.success) setRsvps(rsvpData.rsvps);

      // Buscar Presentes
      const giftsRes = await fetch('/api/admin/gifts', {
        headers: { 'Authorization': token }
      });
      const giftsData = await giftsRes.json();
      if (giftsData.success) setGifts(giftsData.gifts);

      // Buscar Status do WhatsApp
      loadWhatsAppStatus();

    } catch (err) {
      console.error('Erro ao carregar dados do admin', err);
    }
  };

  const loadWhatsAppStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      if (data.success) {
        setWaStatus(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar status do WhatsApp:', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'whatsapp') return;
    loadWhatsAppStatus();
    const interval = setInterval(() => {
      loadWhatsAppStatus();
    }, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  const handleConnectWhatsApp = async () => {
    setWaLoading(true);
    try {
      const res = await fetch('/api/whatsapp/connect', { method: 'POST' });
      const data = await res.json();
      setWaLoading(false);
      if (data.success) {
        setWaStatus(data);
      }
    } catch (err) {
      setWaLoading(false);
      alert('Erro ao conectar ao WhatsApp.');
    }
  };

  const handleLogoutWhatsApp = async () => {
    if (!confirm('Deseja realmente desconectar o WhatsApp?')) return;
    setWaLoading(true);
    try {
      const res = await fetch('/api/whatsapp/logout', { method: 'POST' });
      const data = await res.json();
      setWaLoading(false);
      if (data.success) {
        loadWhatsAppStatus();
      }
    } catch (err) {
      setWaLoading(false);
      alert('Erro ao desconectar WhatsApp.');
    }
  };

  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    if (!testPhone.trim()) {
      alert('Por favor, digite um número de WhatsApp com DDD para o teste.');
      return;
    }
    setTestSending(true);
    setTestResponse(null);
    try {
      const res = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone, message: testMsg })
      });
      const data = await res.json();
      setTestSending(false);
      setTestResponse(data);
    } catch (err) {
      setTestSending(false);
      setTestResponse({ success: false, message: 'Erro de comunicação ao enviar mensagem.' });
    }
  };

  const handleResendWhatsApp = async (giftId) => {
    setResendingGiftId(giftId);
    setActionFeedback(null);
    try {
      const res = await fetch(`/api/admin/gifts/${giftId}/resend-whatsapp`, {
        method: 'POST',
        headers: { 'Authorization': password }
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({ type: 'success', message: data.message || 'WhatsApp reenviado com sucesso!' });
        setGifts(prev => prev.map(g => g.id === giftId ? { ...g, whatsappSent: true, whatsappError: null } : g));
      } else {
        setActionFeedback({ type: 'error', message: data.message || 'Erro ao reenviar WhatsApp.' });
      }
    } catch (err) {
      setActionFeedback({ type: 'error', message: 'Erro de comunicação com o servidor.' });
    } finally {
      setResendingGiftId(null);
    }
  };

  const handleCopyLink = (code) => {
    const url = `${window.location.origin}/convite?convite=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCopyEnvelopeLink = (code) => {
    const url = `${window.location.origin}/convite?convite=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code + '-env');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCopyDirectSiteLink = (code) => {
    const url = `${window.location.origin}/?convite=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code + '-site');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCopyWhatsAppText = (guest) => {
    const guestName = guest.name || guest.guestName || 'Convidado Especial';
    const url = `${window.location.origin}/convite?convite=${guest.code}`;
    const text = `Olá ${guestName}! ✨✉️\n\nPreparamos um convite interativo muito especial para você! Abra o envelope no link abaixo:\n${url}\n\nCom todo nosso amor e carinho,\nAna Clara & Dener 💍🤍`;
    navigator.clipboard.writeText(text);
    setCopiedCode(guest.code + '-wa');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCopyEnvelopeWhatsAppText = (guest) => {
    const guestName = guest.name || guest.guestName || 'Convidado Especial';
    const url = `${window.location.origin}/convite?convite=${guest.code}`;
    const text = `Olá ${guestName}! ✨✉️\n\nPreparamos um convite interativo muito especial para você! Abra o envelope no link abaixo:\n${url}\n\nCom todo nosso amor e carinho,\nAna Clara & Dener 💍🤍`;
    navigator.clipboard.writeText(text);
    setCopiedCode(guest.code + '-env-wa');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleOpenEdit = (guest) => {
    setEditingGuest({
      oldCode: guest.code,
      name: guest.name || guest.guestName || '',
      newCode: guest.code
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingGuest || !editingGuest.name.trim()) {
      alert('O nome do convidado não pode ficar em branco.');
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/guests/${editingGuest.oldCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': password
        },
        body: JSON.stringify({
          name: editingGuest.name.trim(),
          newCode: editingGuest.newCode ? editingGuest.newCode.trim().toUpperCase() : editingGuest.oldCode
        })
      });
      const data = await res.json();
      setSavingEdit(false);

      if (data.success) {
        setEditingGuest(null);
        loadAdminData(password);
        setActionFeedback({ type: 'success', message: 'Convidado atualizado com sucesso!' });
      } else {
        alert(data.message || 'Erro ao atualizar convidado.');
      }
    } catch (err) {
      setSavingEdit(false);
      alert('Erro ao conectar ao servidor para atualizar.');
    }
  };

  const handleDeleteGuest = async (guest) => {
    const guestName = guest.name || guest.guestName || guest.code;
    if (!confirm(`Deseja realmente remover o convidado "${guestName}" (${guest.code})? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/guests/${guest.code}`, {
        method: 'DELETE',
        headers: { 'Authorization': password }
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData(password);
        setActionFeedback({ type: 'success', message: `Convidado "${guestName}" removido com sucesso.` });
      } else {
        alert(data.message || 'Erro ao remover convidado.');
      }
    } catch (err) {
      alert('Erro ao comunicar com o servidor.');
    }
  };

  const handleMigrateToAlphanumeric = async () => {
    if (!confirm('Atenção: Deseja converter TODOS os convites atuais para novos códigos alfanuméricos aleatórios únicos? Os links de acesso mudarão para os novos códigos.')) {
      return;
    }

    setMigrateLoading(true);
    try {
      const res = await fetch('/api/admin/guests/migrate-alphanumeric', {
        method: 'POST',
        headers: { 'Authorization': password }
      });
      const data = await res.json();
      setMigrateLoading(false);
      if (data.success) {
        alert(data.message || 'Convites convertidos com sucesso!');
        loadAdminData(password);
      } else {
        alert(data.message || 'Erro ao converter convites.');
      }
    } catch (err) {
      setMigrateLoading(false);
      alert('Erro ao comunicar com o servidor.');
    }
  };

  const handleDownloadFullCSV = () => {
    if (!rsvps || rsvps.length === 0) {
      alert('Nenhum convidado cadastrado.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Nome,Codigo do Convite,Status,Observacoes,Data Confirmacao,Link do Convite (Envelope),Link Direto do Site\n";
    rsvps.forEach(item => {
      const name = (item.name || item.guestName || '').replace(/"/g, '""');
      const code = item.code || '';
      const status = item.confirmed ? 'Confirmado' : 'Pendente';
      const obs = (item.message || '').replace(/"/g, '""');
      const confirmedDate = item.confirmedAt ? (item.confirmedAt._seconds ? new Date(item.confirmedAt._seconds * 1000).toLocaleString('pt-BR') : new Date(item.confirmedAt).toLocaleString('pt-BR')) : '';
      const envelopeLink = `${window.location.origin}/convite?convite=${code}`;
      const directSiteLink = `${window.location.origin}/?convite=${code}`;
      csvContent += `"${name}","${code}","${status}","${obs}","${confirmedDate}","${envelopeLink}","${directSiteLink}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute("download", `lista_completa_convidados_casamento_${Date.now()}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) {
      alert('Por favor, digite o nome do convidado.');
      return;
    }

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': password },
        body: JSON.stringify({ 
          code: newGuestCode ? newGuestCode.toUpperCase().trim() : undefined, 
          name: newGuestName.trim() 
        })
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData(password);
        setNewGuestCode('');
        setNewGuestName('');
        setActionFeedback({ type: 'success', message: `Convidado "${newGuestName}" cadastrado com sucesso!` });
      } else {
        alert(data.message || 'Erro ao adicionar convidado');
      }
    } catch (err) {
      alert('Erro ao comunicar com a API');
    }
  };

  // Processar Upload de Arquivo TXT ou CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setBulkText(content);
    };
    reader.readAsText(file);
  };

  // Enviar Lista em Massa para o Servidor
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) {
      alert('Por favor, digite os nomes ou faça o upload de um arquivo TXT/CSV.');
      return;
    }

    setBulkLoading(true);
    setBulkResult(null);

    // Converte texto em lista de nomes (separados por quebra de linha ou vírgula)
    const rawLines = bulkText.split(/\r?\n/);
    const parsedGuests = [];

    for (let line of rawLines) {
      line = line.trim();
      if (!line) continue;

      // Se for CSV (ex: "Maria Silva,K9N4P2" ou apenas "Maria Silva")
      if (line.includes(',')) {
        const parts = line.split(',');
        const namePart = parts[0].trim();
        const codePart = parts[1] ? parts[1].trim() : undefined;
        if (namePart) parsedGuests.push({ name: namePart, code: codePart });
      } else {
        parsedGuests.push({ name: line });
      }
    }

    if (parsedGuests.length === 0) {
      alert('Nenhum nome válido encontrado no arquivo ou texto.');
      setBulkLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/guests/bulk', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': password 
        },
        body: JSON.stringify({ guests: parsedGuests })
      });

      const data = await res.json();
      setBulkLoading(false);

      if (data.success) {
        setBulkResult(data.createdGuests);
        loadAdminData(password);
        setBulkText('');
      } else {
        alert(data.message || 'Erro ao gerar convites em massa.');
      }
    } catch (err) {
      setBulkLoading(false);
      alert('Erro ao conectar ao servidor para geração em massa.');
    }
  };

  // Download do Resultado em Arquivo CSV
  const handleDownloadCSV = () => {
    if (!bulkResult || bulkResult.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,Nome,Codigo do Convite,Link do Convite (Envelope),Link Direto do Site\n";
    bulkResult.forEach(item => {
      const envelopeLink = `${window.location.origin}/convite?convite=${item.code}`;
      const directSiteLink = `${window.location.origin}/?convite=${item.code}`;
      csvContent += `"${item.name}","${item.code}","${envelopeLink}","${directSiteLink}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `convites_casamento_ana_e_dener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginWrapper}>
        <div style={styles.loginBox}>
          <Shield size={48} color="var(--color-accent)" style={{ marginBottom: 20 }} />
          <h2 style={styles.loginTitle}>Acesso Restrito</h2>
          <p style={styles.loginSubtitle}>Painel dos Noivos</p>
          
          <form onSubmit={handleLogin} style={styles.form}>
            <input 
              type="password" 
              placeholder="Digite a senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoFocus
            />
            {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}
            <button type="submit" style={styles.loginBtn} disabled={loading}>
              {loading ? 'Entrando...' : 'Acessar Painel'} <Lock size={18} />
            </button>
          </form>
          <a href="/" style={styles.backLink}>Voltar para o site</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.adminContainer}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Painel dos Noivos</h1>
          <p style={styles.headerSubtitle}>Gerenciamento do Casamento</p>
        </div>
        <div style={styles.headerActions}>
          <a href="/" style={styles.viewSiteBtn}>Ver Site</a>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button 
          style={activeTab === 'messages' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={18} /> Mural de Recados ({messages.length})
        </button>
        <button 
          style={activeTab === 'rsvps' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('rsvps')}
        >
          <Users size={18} /> Lista de Convidados ({rsvps.length})
        </button>
        <button 
          style={activeTab === 'gifts' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('gifts')}
        >
          <Shield size={18} /> Presentes Recebidos ({gifts.length})
        </button>
        <button 
          style={activeTab === 'whatsapp' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('whatsapp')}
        >
          <Smartphone size={18} /> WhatsApp Noivos {waStatus.isConnected ? '🟢' : (waStatus.qrCode ? '🟡' : '⚪')}
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'messages' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Todos os Recados</h3>
            <p style={styles.cardSubtitle}>Mensagens enviadas pelos convidados, incluindo as privadas.</p>
            
            <div style={styles.listContainer}>
              {messages.length === 0 ? (
                <p style={styles.emptyState}>Nenhuma mensagem recebida ainda.</p>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} style={styles.messageItem}>
                    <div style={styles.messageHeader}>
                      <span style={styles.messageAuthor}>{msg.author} <small style={{fontWeight:'normal', color:'#888'}}>({msg.relationship})</small></span>
                      {msg.isPublic === false ? (
                        <span style={styles.privateBadge}><EyeOff size={14} /> Mensagem Privada</span>
                      ) : (
                        <span style={styles.publicBadge}><Eye size={14} /> Visível no Site</span>
                      )}
                    </div>
                    <p style={styles.messageText}>"{msg.text}"</p>
                    <span style={styles.messageDate}>{msg.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'rsvps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Feedback / Notificações */}
            {actionFeedback && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: actionFeedback.type === 'success' ? '#EAF8EE' : '#FDE8E8',
                color: actionFeedback.type === 'success' ? '#1E7E34' : '#9B1C1C',
                border: `1px solid ${actionFeedback.type === 'success' ? '#A3E6B4' : '#F8B4B4'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {actionFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{actionFeedback.message}</span>
                </div>
                <button onClick={() => setActionFeedback(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Barra de Métricas e Ações Gerais */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              padding: '18px 24px',
              backgroundColor: '#FAF6F0',
              borderRadius: '12px',
              border: '1px solid #E8DDCE'
            }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="var(--color-marrom)" />
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    Total: <strong style={{ color: 'var(--color-marrom)', fontSize: '16px' }}>{rsvps.length}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28A745' }}></span>
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    Confirmados: <strong style={{ color: '#28A745', fontSize: '16px' }}>{rsvps.filter(r => r.confirmed).length}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D35400' }}></span>
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    Pendentes: <strong style={{ color: '#D35400', fontSize: '16px' }}>{rsvps.filter(r => !r.confirmed).length}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={handleDownloadFullCSV}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#FFF',
                    color: 'var(--color-marrom)',
                    border: '1px solid #D3C3B9',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Baixar lista completa em arquivo CSV contendo links personalizados"
                >
                  <Download size={15} /> Exportar Lista com Links (CSV)
                </button>

                <button
                  onClick={handleMigrateToAlphanumeric}
                  disabled={migrateLoading}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#7F8F6A',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: migrateLoading ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: migrateLoading ? 0.7 : 1
                  }}
                  title="Converter todos os convites para novos códigos alfanuméricos aleatórios"
                >
                  <RefreshCw size={15} className={migrateLoading ? 'spin' : ''} />
                  {migrateLoading ? 'Convertendo...' : 'Converter Todos p/ Alfanumérico'}
                </button>
              </div>
            </div>

            {/* Bloco de Upload e Gerador de Códigos em Massa */}
            <div style={{...styles.card, border: '1.5px solid var(--color-marrom)', backgroundColor: '#FAF6F0', marginBottom: 0}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{...styles.cardTitle, color: 'var(--color-marrom)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Sparkles size={20} color="var(--color-marrom)" /> Gerador de Códigos Alfanuméricos em Massa
                  </h3>
                  <p style={styles.cardSubtitle}>
                    Cole uma lista de nomes ou faça upload de um arquivo TXT/CSV. O sistema gerará <strong>códigos alfanuméricos aleatórios e únicos de 6 dígitos</strong> (sem nenhuma ordem de sequência) e salvará diretamente no banco.
                  </p>
                </div>
                <button 
                  onClick={() => setShowBulkSection(!showBulkSection)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--color-marrom)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  {showBulkSection ? 'Ocultar Ferramenta' : 'Abrir Gerador em Massa'}
                </button>
              </div>

              {showBulkSection && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #D3C3B9' }}>
                  <form onSubmit={handleBulkSubmit}>
                    
                    {/* Botão de Upload de Arquivo TXT / CSV */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                        1. Carregar Arquivo de Lista (.TXT ou .CSV):
                      </label>
                      <input 
                        type="file" 
                        accept=".txt,.csv" 
                        onChange={handleFileUpload}
                        style={{
                          padding: '10px',
                          backgroundColor: '#FFF',
                          border: '1px solid #D3C3B9',
                          borderRadius: '6px',
                          width: '100%',
                          fontSize: '13px'
                        }}
                      />
                    </div>

                    {/* Textarea para Colar Nomes */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                        2. Ou cole/edite a lista de convidados (um nome por linha):
                      </label>
                      <textarea 
                        rows="6" 
                        placeholder="Exemplo:&#10;Leonardo Yuuki&#10;Mariana Silva&#10;Família Allemany&#10;Carlos Eduardo" 
                        value={bulkText} 
                        onChange={(e) => setBulkText(e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #D3C3B9',
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={bulkLoading}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#7F8F6A',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px'
                      }}
                    >
                      {bulkLoading ? 'Gerando Códigos no Banco...' : '⚡ Gerar Códigos Alfanuméricos e Salvar'}
                    </button>
                  </form>

                  {/* Exibição dos Códigos Gerados */}
                  {bulkResult && (
                    <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #A9B39A' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <h4 style={{ margin: 0, color: 'var(--color-marrom)', fontSize: '16px' }}>
                          ✅ {bulkResult.length} Convites Alfanuméricos Salvos no Banco!
                        </h4>
                        <button
                          onClick={handleDownloadCSV}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: 'var(--color-marrom)',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Download size={14} /> Baixar CSV com Links
                        </button>
                      </div>

                      <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #EEE', borderRadius: '6px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #DDD' }}>
                              <th style={{ padding: '8px 12px' }}>Nome do Convidado</th>
                              <th style={{ padding: '8px 12px' }}>Código</th>
                              <th style={{ padding: '8px 12px', textAlign: 'center' }}>Link do Convite (Envelope)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bulkResult.map((item, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #EEE' }}>
                                <td style={{ padding: '8px 12px' }}>{item.name}</td>
                                <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--color-marrom)' }}>{item.code}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                  <button
                                    onClick={() => handleCopyLink(item.code)}
                                    style={{
                                      padding: '4px 8px',
                                      backgroundColor: copiedCode === item.code ? '#EAF8EE' : '#F0F0F0',
                                      color: copiedCode === item.code ? '#1E7E34' : '#333',
                                      border: '1px solid #CCC',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="Copiar link do Convite Interativo (Envelope)"
                                  >
                                    {copiedCode === item.code ? <Check size={12} /> : <Copy size={12} />}
                                    {copiedCode === item.code ? 'Copiado!' : '✉️ Copiar Convite'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Campo de Busca Rápida de Convidados */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFF',
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid #EAEAEA'
            }}>
              <Search size={18} color="#888" />
              <input
                type="text"
                placeholder="Buscar convidado por nome ou código..."
                value={searchGuest}
                onChange={(e) => setSearchGuest(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  width: '100%',
                  color: '#333'
                }}
              />
              {searchGuest && (
                <button
                  onClick={() => setSearchGuest('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div style={styles.gridContainer}>
              {/* Coluna 1: Convidados Confirmados */}
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ ...styles.cardTitle, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#28A745" /> Convidados Confirmados ({rsvps.filter(r => r.confirmed && (!searchGuest || (r.guestName || r.name || '').toLowerCase().includes(searchGuest.toLowerCase()) || (r.code || '').toLowerCase().includes(searchGuest.toLowerCase()))).length})
                  </h3>
                </div>
                <p style={styles.cardSubtitle}>Pessoas que já validaram e confirmaram presença.</p>
                
                <div style={styles.listContainer}>
                  {rsvps.filter(r => r.confirmed && (!searchGuest || (r.guestName || r.name || '').toLowerCase().includes(searchGuest.toLowerCase()) || (r.code || '').toLowerCase().includes(searchGuest.toLowerCase()))).length === 0 ? (
                    <p style={styles.emptyState}>{searchGuest ? 'Nenhum convidado confirmado com esse termo.' : 'Nenhuma confirmação ainda.'}</p>
                  ) : (
                    rsvps
                      .filter(r => r.confirmed && (!searchGuest || (r.guestName || r.name || '').toLowerCase().includes(searchGuest.toLowerCase()) || (r.code || '').toLowerCase().includes(searchGuest.toLowerCase())))
                      .map((rsvp, idx) => (
                        <div key={idx} style={{ ...styles.rsvpItem, borderLeft: '4px solid #28A745' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <strong style={{ fontSize: '15px', color: 'var(--color-marrom)' }}>{rsvp.guestName || rsvp.name}</strong> 
                              <span style={styles.codeTag}>{rsvp.code}</span>
                            </div>

                            {/* Ações Rápidas */}
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                onClick={() => handleCopyLink(rsvp.code)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: copiedCode === rsvp.code ? '#EAF8EE' : '#FFF',
                                  color: copiedCode === rsvp.code ? '#1E7E34' : '#555',
                                  border: '1px solid #DDD',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Copiar link direto do convite para o site"
                              >
                                {copiedCode === rsvp.code ? <Check size={12} /> : <Copy size={12} />}
                                {copiedCode === rsvp.code ? 'Copiado!' : 'Site'}
                              </button>

                              <button
                                onClick={() => handleCopyEnvelopeLink(rsvp.code)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: copiedCode === rsvp.code + '-env' ? '#EAF8EE' : '#FFF',
                                  color: copiedCode === rsvp.code + '-env' ? '#1E7E34' : '#745D57',
                                  border: '1px solid #DDD',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontWeight: 600
                                }}
                                title="Copiar link do Convite Interativo (Envelope 3D + Música)"
                              >
                                {copiedCode === rsvp.code + '-env' ? <Check size={12} /> : '✉️'}
                                {copiedCode === rsvp.code + '-env' ? 'Copiado!' : 'Envelope'}
                              </button>

                              <button
                                onClick={() => handleCopyWhatsAppText(rsvp)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: copiedCode === rsvp.code + '-wa' ? '#EAF8EE' : '#FFF',
                                  color: copiedCode === rsvp.code + '-wa' ? '#1E7E34' : '#2D6A4F',
                                  border: '1px solid #DDD',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Copiar mensagem personalizada com link para enviar pelo WhatsApp"
                              >
                                {copiedCode === rsvp.code + '-wa' ? <CheckCheck size={12} /> : <Share2 size={12} />}
                                {copiedCode === rsvp.code + '-wa' ? 'Msg Copiada!' : 'WhatsApp'}
                              </button>

                              <button
                                onClick={() => handleOpenEdit(rsvp)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#FFF',
                                  color: 'var(--color-marrom)',
                                  border: '1px solid #DDD',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Editar nome ou código do convidado"
                              >
                                <Edit2 size={12} /> Editar
                              </button>

                              <button
                                onClick={() => handleDeleteGuest(rsvp)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#FFF',
                                  color: '#C0392B',
                                  border: '1px solid #DDD',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Excluir convidado"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div style={styles.rsvpDetails}>
                            {rsvp.message && <p style={styles.rsvpNotes}>Obs: {rsvp.message}</p>}
                            <small style={{ color: '#888' }}>
                              Confirmado em: {rsvp.confirmedAt ? (rsvp.confirmedAt._seconds ? new Date(rsvp.confirmedAt._seconds * 1000).toLocaleString('pt-BR') : new Date(rsvp.confirmedAt).toLocaleString('pt-BR')) : 'Data Indisponível'}
                            </small>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Coluna 2: Adicionar Individual e Lista de Pendentes */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Gerenciar Convites Individuais</h3>
                <p style={styles.cardSubtitle}>Crie novos códigos de convite avulsos.</p>
                
                <form onSubmit={handleAddGuest} style={styles.addGuestForm}>
                  <div style={styles.inputGroup}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)' }}>Nome do Convidado: *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Mariana Silva ou Família Allemany" 
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)' }}>
                      Código do Convite (Opcional - se vazio, gerará alfanumérico):
                    </label>
                    <input 
                      type="text" 
                      placeholder="Deixe em branco para gerar aleatório (ex: 26SL87)" 
                      value={newGuestCode}
                      onChange={(e) => setNewGuestCode(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <button type="submit" style={styles.addBtn}>
                    <Plus size={18} /> Adicionar Convidado Individual
                  </button>
                </form>

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#444', fontFamily: 'Inter', fontSize: '15px' }}>
                    Convites Pendentes ({rsvps.filter(r => !r.confirmed && (!searchGuest || (r.name || r.guestName || '').toLowerCase().includes(searchGuest.toLowerCase()) || (r.code || '').toLowerCase().includes(searchGuest.toLowerCase()))).length})
                  </h4>
                </div>

                <div style={{...styles.pendingList, maxHeight: '420px', overflowY: 'auto'}}>
                  {rsvps.filter(r => !r.confirmed && (!searchGuest || (r.name || r.guestName || '').toLowerCase().includes(searchGuest.toLowerCase()) || (r.code || '').toLowerCase().includes(searchGuest.toLowerCase()))).length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '13px' }}>
                      {searchGuest ? 'Nenhum convite pendente encontrado com esse termo.' : 'Todos os convidados confirmaram presença! 🎉'}
                    </p>
                  ) : (
                    rsvps
                      .filter(r => !r.confirmed && (!searchGuest || (r.name || r.guestName || '').toLowerCase().includes(searchGuest.toLowerCase()) || (r.code || '').toLowerCase().includes(searchGuest.toLowerCase())))
                      .map((g, idx) => (
                        <div key={idx} style={{ ...styles.pendingItem, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#333' }}>{g.name || g.guestName}</span>
                            <span style={styles.codeTag}>{g.code}</span>
                          </div>

                          {/* Ações do Convidado Pendente */}
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid #F5F5F5', paddingTop: '6px' }}>
                            <button
                              onClick={() => handleCopyLink(g.code)}
                              style={{
                                padding: '3px 8px',
                                backgroundColor: copiedCode === g.code ? '#EAF8EE' : '#F9F9F9',
                                color: copiedCode === g.code ? '#1E7E34' : '#555',
                                border: '1px solid #DDD',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Copiar link com código para o site"
                            >
                              {copiedCode === g.code ? <Check size={12} /> : <Copy size={12} />}
                              {copiedCode === g.code ? 'Copiado!' : 'Site'}
                            </button>

                            <button
                              onClick={() => handleCopyEnvelopeLink(g.code)}
                              style={{
                                padding: '3px 8px',
                                backgroundColor: copiedCode === g.code + '-env' ? '#EAF8EE' : '#F9F9F9',
                                color: copiedCode === g.code + '-env' ? '#1E7E34' : '#745D57',
                                border: '1px solid #DDD',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 600
                              }}
                              title="Copiar link do Convite Interativo (Envelope 3D + Música)"
                            >
                              {copiedCode === g.code + '-env' ? <Check size={12} /> : '✉️'}
                              {copiedCode === g.code + '-env' ? 'Copiado!' : 'Envelope'}
                            </button>

                            <button
                              onClick={() => handleCopyWhatsAppText(g)}
                              style={{
                                padding: '3px 8px',
                                backgroundColor: copiedCode === g.code + '-wa' ? '#EAF8EE' : '#F9F9F9',
                                color: copiedCode === g.code + '-wa' ? '#1E7E34' : '#2D6A4F',
                                border: '1px solid #DDD',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Copiar texto de convite pronto para WhatsApp"
                            >
                              {copiedCode === g.code + '-wa' ? <CheckCheck size={12} /> : <Share2 size={12} />}
                              {copiedCode === g.code + '-wa' ? 'Msg Copiada!' : 'WhatsApp'}
                            </button>

                            <button
                              onClick={() => handleOpenEdit(g)}
                              style={{
                                padding: '3px 8px',
                                backgroundColor: '#F9F9F9',
                                color: 'var(--color-marrom)',
                                border: '1px solid #DDD',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Editar nome ou código do convidado"
                            >
                              <Edit2 size={12} /> Editar
                            </button>

                            <button
                              onClick={() => handleDeleteGuest(g)}
                              style={{
                                padding: '3px 8px',
                                backgroundColor: '#F9F9F9',
                                color: '#C0392B',
                                border: '1px solid #DDD',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Excluir convidado"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal de Edição de Convidado */}
            {editingGuest && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                padding: '20px'
              }}>
                <div style={{
                  backgroundColor: '#FFF',
                  borderRadius: '12px',
                  padding: '30px',
                  width: '100%',
                  maxWidth: '480px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: 'var(--color-marrom)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Edit2 size={20} /> Editar Convidado
                    </h3>
                    <button
                      onClick={() => setEditingGuest(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                        Nome do Convidado:
                      </label>
                      <input 
                        type="text" 
                        required
                        value={editingGuest.name}
                        onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                        style={styles.input}
                        autoFocus
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                        Código do Convite:
                      </label>
                      <input 
                        type="text" 
                        required
                        value={editingGuest.newCode}
                        onChange={(e) => setEditingGuest({ ...editingGuest, newCode: e.target.value.toUpperCase() })}
                        style={{ ...styles.input, fontFamily: 'monospace' }}
                      />
                      <small style={{ color: '#888', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        Se alterar o código, o link anterior deixará de funcionar.
                      </small>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setEditingGuest(null)}
                        style={{
                          padding: '10px 18px',
                          backgroundColor: '#F0F0F0',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#666'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={savingEdit}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'var(--color-accent)',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: savingEdit ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {savingEdit ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'gifts' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Presentes e Contribuições</h3>
            <p style={styles.cardSubtitle}>Acompanhe todos os presentes gerados através da integração com o Asaas.</p>
            
            {/* Barra Discreta de Totais */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '10px',
              paddingBottom: '12px',
              borderBottom: '1px solid #EAEAEA'
            }}>
              <span style={{ fontSize: '13px', color: '#666' }}>
                Presentes Confirmados: <strong style={{ color: 'var(--color-marrom)' }}>{gifts.filter(g => g.status === 'PAID').length}</strong> <span style={{ color: '#999', fontSize: '12px' }}>(de {gifts.length} gerados)</span>
              </span>
              <span style={{ fontSize: '13px', color: '#888' }}>
                Total acumulado: <strong style={{ color: '#5C6B48', fontWeight: '600' }}>R$ {gifts.filter(g => g.status === 'PAID').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toFixed(2).replace('.', ',')}</strong>
              </span>
            </div>

            {/* Nota de Rodapé Minimalista */}
            <p style={{
              fontSize: '11px',
              color: '#AAA',
              lineHeight: '1.4',
              margin: '0 0 24px 0'
            }}>
              * Vendas parceladas via Asaas têm repasses em conta liberados gradualmente a cada parcela quitada.
            </p>

            {actionFeedback && (
              <div style={{
                marginBottom: '20px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: actionFeedback.type === 'success' ? '#EAF8EE' : '#FDE8E8',
                color: actionFeedback.type === 'success' ? '#1E7E34' : '#9B1C1C',
                border: `1px solid ${actionFeedback.type === 'success' ? '#A3E6B4' : '#F8B4B4'}`
              }}>
                {actionFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {actionFeedback.message}
              </div>
            )}

            <div style={styles.listContainer}>
              {gifts.length === 0 ? (
                <p style={styles.emptyState}>Nenhum presente registrado ainda.</p>
              ) : (
                gifts.map((gift, idx) => (
                  <div key={idx} style={{...styles.messageItem, borderLeftColor: gift.status === 'PAID' ? 'var(--color-verde)' : '#f39c12'}}>
                    <div style={styles.messageHeader}>
                      <span style={{fontWeight: 'bold', color: 'var(--color-marrom)', fontSize: '16px'}}>
                        {gift.giftTitle}
                      </span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {gift.status === 'PAID' ? (
                          <span style={styles.publicBadge}><Check size={14} /> Recebido</span>
                        ) : (
                          <span style={{...styles.privateBadge, backgroundColor: '#fdf3e7', color: '#d35400'}}><Lock size={14} /> Aguardando Pagamento</span>
                        )}
                        {gift.status === 'PAID' && (
                          gift.whatsappSent ? (
                            <span style={{ ...styles.publicBadge, backgroundColor: '#EAF8EE', color: '#1E7E34' }}>
                              <Check size={12} /> WhatsApp Enviado
                            </span>
                          ) : (
                            <span 
                              style={{ ...styles.privateBadge, backgroundColor: '#FDE8E8', color: '#9B1C1C', cursor: 'help' }} 
                              title={gift.whatsappError || 'WhatsApp ainda não foi entregue'}
                            >
                              <AlertCircle size={12} /> WhatsApp Pendente
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                        De: <strong>{gift.guestName}</strong> <br/>
                        <small style={{ color: 'var(--color-verde-oliva)', fontWeight: 600 }}>
                          {gift.guestPhone ? `📱 ${gift.guestPhone}` : (gift.guestEmail ? `✉️ ${gift.guestEmail}` : 'Sem telefone')}
                        </small>
                      </p>
                      <div style={{ textAlign: 'right' }}>
                        <h4 style={{ margin: 0, fontSize: '20px', color: 'var(--color-verde-oliva)' }}>
                          R$ {Number(gift.amount).toFixed(2).replace('.', ',')}
                        </h4>
                        {gift.status === 'PAID' && (
                          <button
                            onClick={() => handleResendWhatsApp(gift.id)}
                            disabled={resendingGiftId === gift.id}
                            style={{
                              marginTop: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              fontSize: '12px',
                              fontWeight: '600',
                              borderRadius: '6px',
                              border: '1px solid #c3e6cb',
                              backgroundColor: '#f4fbf6',
                              color: '#155724',
                              cursor: resendingGiftId === gift.id ? 'not-allowed' : 'pointer',
                              opacity: resendingGiftId === gift.id ? 0.6 : 1
                            }}
                            title="Enviar ou reenviar mensagem de agradecimento via WhatsApp"
                          >
                            <Send size={12} />
                            {resendingGiftId === gift.id ? 'Enviando...' : (gift.whatsappSent ? 'Reenviar WhatsApp' : 'Enviar WhatsApp')}
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Registrado em: {gift.createdAtFormatted || (gift.createdAt ? new Date(gift.createdAt._seconds ? gift.createdAt._seconds * 1000 : gift.createdAt).toLocaleString('pt-BR') : 'Data Indisponível')}</span>
                      {(gift.paidAtFormatted || gift.paidAt) && <span>Pago em: {gift.paidAtFormatted || new Date(gift.paidAt._seconds ? gift.paidAt._seconds * 1000 : gift.paidAt).toLocaleString('pt-BR')}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Aba de Gerenciamento do WhatsApp */}
        {activeTab === 'whatsapp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Status Card Principal */}
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ ...styles.cardTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={22} color="var(--color-marrom)" /> 
                    Conexão do WhatsApp dos Noivos
                  </h3>
                  <p style={styles.cardSubtitle}>
                    O sistema utiliza o WhatsApp dos noivos via Baileys para enviar mensagens de agradecimento automáticas aos convidados que presentearem o casal.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={loadWhatsAppStatus} 
                    style={{ ...styles.addGuestBtn, backgroundColor: '#EEE', color: '#333' }}
                    title="Atualizar Status"
                  >
                    <RefreshCw size={16} /> Atualizar
                  </button>
                  {waStatus.isConnected && (
                    <button 
                      onClick={handleLogoutWhatsApp} 
                      style={{ ...styles.addGuestBtn, backgroundColor: '#FDE8E8', color: '#9B1C1C' }}
                    >
                      <LogOut size={16} /> Desconectar
                    </button>
                  )}
                </div>
              </div>

              {/* Status do WhatsApp */}
              {waStatus.isConnected ? (
                /* Conectado */
                <div style={{ padding: '24px', backgroundColor: '#EAF8EE', borderRadius: '12px', border: '1px solid #A3E6B4' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#2ECC71' }}></div>
                    <h4 style={{ margin: 0, color: '#1E7E34', fontSize: '18px' }}>
                      WhatsApp Conectado e Pronto para Envios!
                    </h4>
                  </div>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#2D6A4F' }}>
                    Todas as confirmações de presentes recebidos dispararão automaticamente uma mensagem carinhosa para o WhatsApp do convidado.
                  </p>
                  {waStatus.user?.id && (
                    <div style={{ fontSize: '12px', color: '#555', backgroundColor: '#FFF', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
                      Sessão ativa: <strong>{waStatus.user.id.split(':')[0] || waStatus.user.id}</strong>
                    </div>
                  )}
                </div>
              ) : waStatus.qrCode ? (
                /* QR Code Pronto para Escaneamento */
                <div style={{ padding: '24px', backgroundColor: '#FFF9E6', borderRadius: '12px', border: '1px solid #F5D77F', textAlign: 'center' }}>
                  <h4 style={{ color: '#B7791F', fontSize: '20px', marginBottom: '8px' }}>
                    📱 Escaneie o QR Code com o WhatsApp dos Noivos
                  </h4>
                  <p style={{ fontSize: '14px', color: '#744210', maxWidth: '500px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                    1. Abra o WhatsApp no celular dos noivos.<br />
                    2. Vá em <strong>Configurações</strong> &gt; <strong>Aparelhos Conectados</strong> &gt; <strong>Conectar Aparelho</strong>.<br />
                    3. Aponte a câmera para o QR Code abaixo:
                  </p>

                  <div style={{ display: 'inline-block', padding: '16px', backgroundColor: '#FFF', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                    <img 
                      src={waStatus.qrCode} 
                      alt="QR Code WhatsApp" 
                      style={{ width: '260px', height: '260px', display: 'block' }} 
                    />
                  </div>

                  <div>
                    <button 
                      onClick={handleConnectWhatsApp} 
                      disabled={waLoading}
                      style={{ ...styles.addGuestBtn, margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <RefreshCw size={16} className={waLoading ? 'spin' : ''} /> 
                      {waLoading ? 'Gerando novo código...' : 'Gerar Novo QR Code'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Desconectado */
                <div style={{ padding: '30px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px dashed #CCC', textAlign: 'center' }}>
                  <Smartphone size={48} color="#888" style={{ marginBottom: '12px' }} />
                  <h4 style={{ color: '#444', fontSize: '18px', marginBottom: '8px' }}>
                    WhatsApp Desconectado
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666', maxWidth: '450px', margin: '0 auto 20px auto' }}>
                    Clique no botão abaixo para iniciar o cliente e gerar o QR Code de conexão.
                  </p>
                  <button 
                    onClick={handleConnectWhatsApp} 
                    disabled={waLoading}
                    style={{ ...styles.addGuestBtn, padding: '12px 24px', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Smartphone size={18} /> 
                    {waLoading ? 'Iniciando WhatsApp...' : 'Conectar WhatsApp dos Noivos'}
                  </button>
                </div>
              )}
            </div>

            {/* Ferramenta de Teste de Envio */}
            <div style={styles.card}>
              <h3 style={{ ...styles.cardTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Send size={20} color="var(--color-marrom)" /> 
                Testar Envio de Mensagem no WhatsApp
              </h3>
              <p style={styles.cardSubtitle}>
                Envie uma mensagem de teste para o seu próprio número ou de um padrinho para validar a entrega.
              </p>

              <form onSubmit={handleSendTestMessage} style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                    Número com DDD (ex: 11987654321): *
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="11987654321" 
                    value={testPhone} 
                    onChange={(e) => setTestPhone(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-marrom)', marginBottom: '6px' }}>
                    Mensagem Opcional (deixe em branco para usar o texto padrão):
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="✨ Teste de envio de mensagem de casamento Ana Clara & Dener!" 
                    value={testMsg} 
                    onChange={(e) => setTestMsg(e.target.value)}
                    style={{ ...styles.input, resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={testSending || !waStatus.isConnected}
                  style={{ 
                    ...styles.addGuestBtn, 
                    padding: '12px 24px', 
                    fontSize: '14px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    opacity: (!waStatus.isConnected || testSending) ? 0.6 : 1,
                    cursor: (!waStatus.isConnected || testSending) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={16} /> 
                  {testSending ? 'Enviando mensagem...' : 'Enviar Mensagem de Teste'}
                </button>

                {!waStatus.isConnected && (
                  <p style={{ fontSize: '12px', color: '#D35400', marginTop: '8px' }}>
                    ⚠️ Conecte o WhatsApp dos noivos acima para poder enviar mensagens de teste.
                  </p>
                )}

                {testResponse && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    fontSize: '13px',
                    backgroundColor: testResponse.success ? '#EAF8EE' : '#FDE8E8',
                    color: testResponse.success ? '#1E7E34' : '#9B1C1C'
                  }}>
                    {testResponse.message}
                  </div>
                )}
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  loginWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background)' },
  loginBox: { backgroundColor: '#FFF', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '90%' },
  loginTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', color: 'var(--color-text)', margin: '0 0 5px 0' },
  loginSubtitle: { color: 'var(--color-text-light)', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '16px', outline: 'none' },
  loginBtn: { padding: '12px', backgroundColor: 'var(--color-text)', color: '#FFF', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' },
  errorText: { color: '#e74c3c', fontSize: '14px', margin: '0' },
  backLink: { display: 'inline-block', marginTop: '20px', color: 'var(--color-text-light)', textDecoration: 'none', fontSize: '14px' },
  
  adminContainer: { minHeight: '100vh', backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#FFF', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAEAEA' },
  headerTitle: { fontFamily: 'Cormorant Garamond, serif', margin: 0, fontSize: '28px', color: 'var(--color-text)' },
  headerSubtitle: { margin: 0, color: '#888', fontSize: '14px' },
  headerActions: { display: 'flex', gap: '15px', alignItems: 'center' },
  viewSiteBtn: { textDecoration: 'none', color: 'var(--color-accent)', fontWeight: 'bold' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' },
  
  tabs: { display: 'flex', padding: '0 40px', gap: '10px', marginTop: '20px' },
  tab: { padding: '12px 20px', backgroundColor: '#EAEAEA', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontWeight: '600' },
  activeTab: { padding: '12px 20px', backgroundColor: '#FFF', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 'bold', boxShadow: '0 -4px 10px rgba(0,0,0,0.02)' },
  
  content: { backgroundColor: '#FFF', padding: '40px', minHeight: 'calc(100vh - 160px)' },
  card: { backgroundColor: '#FFF', border: '1px solid #EAEAEA', borderRadius: '12px', padding: '25px', marginBottom: '30px', flex: 1 },
  cardTitle: { margin: '0 0 5px 0', color: '#333' },
  cardSubtitle: { margin: '0 0 20px 0', color: '#888', fontSize: '14px' },
  
  listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#AAA', fontStyle: 'italic' },
  
  messageItem: { padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' },
  messageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  messageAuthor: { fontWeight: 'bold', color: '#333' },
  privateBadge: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFEBE9', color: '#D73A49', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  publicBadge: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#E6FFED', color: '#28A745', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  messageText: { fontStyle: 'italic', color: '#555', margin: '0 0 10px 0' },
  messageDate: { fontSize: '12px', color: '#AAA' },
  
  gridContainer: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  rsvpItem: { padding: '15px', backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #EAEAEA' },
  codeTag: { backgroundColor: '#EAEAEA', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginLeft: '10px', fontFamily: 'monospace' },
  rsvpDetails: { marginTop: '10px', fontSize: '13px', color: '#666', display: 'flex', flexDirection: 'column', gap: '5px' },
  rsvpNotes: { backgroundColor: '#FFF', padding: '8px', borderRadius: '4px', border: '1px dashed #CCC', margin: 0 },
  
  addGuestForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  addBtn: { padding: '12px', backgroundColor: 'var(--color-accent)', color: '#FFF', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' },
  
  pendingList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  pendingItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#FFF', border: '1px solid #EEE', borderRadius: '6px', fontSize: '14px' }
};
