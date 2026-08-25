import React, { useEffect, useState } from 'react';

export default function InteractiveInvite() {
  const [iframeSrc, setIframeSrc] = useState('/convite.html');

  useEffect(() => {
    // Preservar parâmetros da URL (ex: ?convite=26SL87)
    const search = window.location.search;
    setIframeSrc(`/convite.html${search}`);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#FAF1E1',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999
    }}>
      {/* Iframe 100% Idêntico e Nativo do Canva */}
      <iframe
        src={iframeSrc}
        title="Convite Interativo Ana Clara & Dener"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        allow="autoplay"
      />
    </div>
  );
}
