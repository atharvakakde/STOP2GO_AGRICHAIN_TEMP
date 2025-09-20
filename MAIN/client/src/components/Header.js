import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-farmer', label: 'Add Farmer', icon: '👨‍🌾' },
    { id: 'harvest', label: 'Harvest Item', icon: '🌾' },
    { id: 'track', label: 'Track Item', icon: '🔍' }
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <h1 className="logo-text">AgriChain</h1>
          </div>
          
          <nav className="nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
