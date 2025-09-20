import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddFarmer from './components/AddFarmer';
import HarvestItem from './components/HarvestItem';
import TrackItem from './components/TrackItem';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accounts] = useState([
    '0xf7b5dE17E556c4fCb02F6d86Fec07decD382110B',
    '0x742d35Cc4419A5b3BFC7f4d2D6B7F4d3d5cA9c7A',
    '0x123d45B2419A5b3BFC7f4d2D6B7F4d3d5cA9c8B'
  ]);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <div className="container">
          {notifications.length > 0 && (
            <div className="notifications">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification ${notification.type}`}>
                  {notification.message}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'add-farmer' && <AddFarmer accounts={accounts} addNotification={addNotification} />}
          {activeTab === 'harvest' && <HarvestItem accounts={accounts} addNotification={addNotification} />}
          {activeTab === 'track' && <TrackItem addNotification={addNotification} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
