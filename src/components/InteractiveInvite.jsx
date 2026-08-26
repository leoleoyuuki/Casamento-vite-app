import React, { useEffect } from 'react';

export default function InteractiveInvite() {
  useEffect(() => {
    const search = window.location.search;
    window.location.replace(`/convite.html${search}`);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#FAF1E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: '#745D57'
    }}>
      Carregando Convite...
    </div>
  );
}
