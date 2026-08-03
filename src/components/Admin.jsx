import React, { useState, useEffect } from 'react';
import { Lock, LogOut, MessageSquare, Users, Check, X, Shield, EyeOff, Eye, Plus, Trash2 } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'rsvps'
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Dados
  const [messages, setMessages] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formulário de Convidados
  const [newGuestCode, setNewGuestCode] = useState('');
  const [newGuestName, setNewGuestName] = useState('');

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
        setIsAuthenticated(true);
        loadAdminData(data.token); // Usamos a própria senha como token simples no MVP
      } else {
        setErrorMsg('Senha incorreta.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Erro ao tentar conectar com o servidor.');
    }
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

    } catch (err) {
      console.error('Erro ao carregar dados do admin', err);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuestCode || !newGuestName) return;

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': password },
        body: JSON.stringify({ code: newGuestCode.toUpperCase(), name: newGuestName })
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData(password);
        setNewGuestCode('');
        setNewGuestName('');
      } else {
        alert(data.message || 'Erro ao adicionar convidado');
      }
    } catch (err) {
      alert('Erro ao comunicar com a API');
    }
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
          <button onClick={() => setIsAuthenticated(false)} style={styles.logoutBtn}>
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
          <div style={styles.gridContainer}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Convidados Confirmados</h3>
              <p style={styles.cardSubtitle}>Pessoas que validaram o código de convite.</p>
              
              <div style={styles.listContainer}>
                {rsvps.filter(r => r.confirmed).length === 0 ? (
                  <p style={styles.emptyState}>Nenhuma confirmação ainda.</p>
                ) : (
                  rsvps.filter(r => r.confirmed).map((rsvp, idx) => (
                    <div key={idx} style={styles.rsvpItem}>
                      <div>
                        <strong>{rsvp.guestName}</strong> 
                        <span style={styles.codeTag}>{rsvp.code}</span>
                      </div>
                      <div style={styles.rsvpDetails}>
                        {rsvp.message && <p style={styles.rsvpNotes}>Obs: {rsvp.message}</p>}
                        <small>{rsvp.confirmedAt ? new Date(rsvp.confirmedAt._seconds * 1000).toLocaleString('pt-BR') : 'Data Indisponível'}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Gerenciar Convites</h3>
              <p style={styles.cardSubtitle}>Crie novos códigos para seus convidados.</p>
              
              <form onSubmit={handleAddGuest} style={styles.addGuestForm}>
                <div style={styles.inputGroup}>
                  <label>Código do Convite</label>
                  <input 
                    type="text" 
                    placeholder="Ex: FAMILIA-SILVA" 
                    value={newGuestCode}
                    onChange={(e) => setNewGuestCode(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>Nome Principal</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Família Silva" 
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <button type="submit" style={styles.addBtn}>
                  <Plus size={18} /> Adicionar Convite
                </button>
              </form>

              <h4 style={{marginTop: 30, color: '#555', fontFamily: 'Inter'}}>Convites Pendentes (Não confirmados)</h4>
              <div style={styles.pendingList}>
                {rsvps.filter(r => !r.confirmed).map((g, idx) => (
                  <div key={idx} style={styles.pendingItem}>
                    <span>{g.name}</span>
                    <span style={styles.codeTag}>{g.code}</span>
                  </div>
                ))}
              </div>
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
