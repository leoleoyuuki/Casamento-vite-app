import React, { useState } from 'react';
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
import InteractiveInvite from './components/InteractiveInvite';

export default function App() {
  const [selectedGift, setSelectedGift] = useState(null);

  // Roteamento Simples
  const path = window.location.pathname;
  
  if (path === '/admin') {
    return <Admin />;
  }

  if (path === '/convite' || path === '/convite-interativo') {
    return <InteractiveInvite />;
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
