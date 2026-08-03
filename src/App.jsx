import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import OurStory from './components/OurStory';
import EventDetails from './components/EventDetails';
import DressCode from './components/DressCode';
import GiftList from './components/GiftList';
import CheckoutModal from './components/CheckoutModal';
import RSVP from './components/RSVP';
import MessageBoard from './components/MessageBoard';
import Footer from './components/Footer';

export default function App() {
  const [selectedGift, setSelectedGift] = useState(null);

  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
        <Countdown />
        <OurStory />
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
