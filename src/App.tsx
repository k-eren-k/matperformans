import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Whiteboard } from './components/Whiteboard';
import { Layout } from './components/Layout';
import { PublicHome } from './components/PublicHome';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import Teachers from './components/Teachers'; // Yeni sayfa


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<><Layout><PublicHome /></Layout><Footer /></>} />
        <Route path="/about" element={<><Layout><About /></Layout><Footer/></>} />
        <Route path="/teachers" element={<><Layout><Teachers /></Layout><Footer/></>} /> {/* Yeni Route */}
        <Route path="/contact" element={<><Layout><Contact /></Layout><Footer /></>} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/Whiteboard" element={<Whiteboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
} 

export default App;