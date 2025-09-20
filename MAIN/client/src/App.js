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
  const [accounts, setAccounts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // Fetch accounts from blockchain on app load
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/accounts');
        if (response.ok) {
          const accountsList = await response.json();
          setAccounts(accountsList.slice(0, 5)); // Use first 5 accounts
          console.log('Loaded accounts:', accountsList.slice(0, 5));
        } else {
          console.error('Failed to fetch accounts');
          addNotification('❌ Failed to load blockchain accounts', 'error');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        addNotification('❌ Error connecting to blockchain', 'error');
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

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
          {activeTab === 'add-farmer' && (
            isLoadingAccounts ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading blockchain accounts...</p>
              </div>
            ) : (
              <AddFarmer accounts={accounts} addNotification={addNotification} />
            )
          )}
          {activeTab === 'harvest' && (
            isLoadingAccounts ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading blockchain accounts...</p>
              </div>
            ) : (
              <HarvestItem accounts={accounts} addNotification={addNotification} />
            )
          )}
          {activeTab === 'track' && <TrackItem addNotification={addNotification} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
