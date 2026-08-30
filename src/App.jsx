import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import OurStory from './components/OurStory';
import PhotoDivider from './components/PhotoDivider';
import EventDetails from './components/EventDetails';
import DressCode from './components/DressCode';
import GiftList from './components/GiftList';
import CheckoutModal from './components/CheckoutModal';
import RSVP from './components/RSVP';
import MessageBoard from './components/MessageBoard';
import Footer from './components/Footer';
import Admin from './components/Admin';

export default function App() {
  const [selectedGift, setSelectedGift] = useState(null);

  // Roteamento Simples
  const path = window.location.pathname;

  // Redirecionamento imediato da rota /convite para o link oficial do Canva
  if (path === '/convite' || path === '/convites' || path === '/convite-interativo') {
    window.location.replace('https://anaclaraedener123.my.canva.site/c-pia-de-c-pia-de-mcdp-mabel');
    return null;
  }

  // Auto-scroll para #rsvp se houver convite ou hash na URL
  useEffect(() => {
    const scrollToTarget = () => {
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);
      const isRsvpTarget = hash.includes('rsvp') || hash.includes('confirmar') || search.has('convite') || search.has('code');

      if (isRsvpTarget) {
        const el = document.getElementById('rsvp');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    scrollToTarget();
    const t1 = setTimeout(scrollToTarget, 300);
    const t2 = setTimeout(scrollToTarget, 800);
    const t3 = setTimeout(scrollToTarget, 1500);

    window.addEventListener('load', scrollToTarget);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('load', scrollToTarget);
    };
  }, []);
  
  if (path === '/admin') {
    return <Admin />;
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
        <Countdown />
        <OurStory />
        <PhotoDivider image="/assets/divisoria1.png" />
        <EventDetails />
        <DressCode />
        <GiftList onSelectGift={(gift) => setSelectedGift(gift)} />
        <RSVP />
        <MessageBoard />
      </main>
      <Footer />

      {/* Modal de Checkout Asaas */}
      {selectedGift && (
        <CheckoutModal 
          gift={selectedGift} 
          onClose={() => setSelectedGift(null)} 
        />
      )}
    </div>
  );
}
