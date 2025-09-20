import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalFarmers: 0,
    recentItems: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        // Fetch accounts to get farmer count
        const accountsResponse = await fetch('http://localhost:5000/accounts');
        const accounts = accountsResponse.ok ? await accountsResponse.json() : [];
        
        // Try to get recent items (we'll try items 1-5)
        const recentItems = [];
        let totalItems = 0;
        
        for (let i = 1; i <= 5; i++) {
          try {
            const itemResponse = await fetch(`http://localhost:5000/item/${i}`);
            if (itemResponse.ok) {
              const item = await itemResponse.json();
              recentItems.push({
                id: item.id,
                name: item.name,
                farmer: `${item.farmer.slice(0, 6)}...${item.farmer.slice(-4)}`,
                date: new Date().toISOString().split('T')[0] // Use today's date
              });
              totalItems = Math.max(totalItems, parseInt(item.id));
            }
          } catch (err) {
            // Item doesn't exist, continue
            break;
          }
        }
        
        setStats({
          totalItems,
          totalFarmers: Math.min(accounts.length, 5), // Assume max 5 farmers for demo
          recentItems
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to demo data
        setStats({
          totalItems: 0,
          totalFarmers: 0,
          recentItems: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealStats();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>Welcome to AgriChain</h2>
        <p>Track your agricultural supply chain from farm to table with blockchain technology.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-info">
            <h3>{stats.totalItems}</h3>
            <p>Total Items Harvested</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🌾</div>
          <div className="stat-info">
            <h3>{stats.totalFarmers}</h3>
            <p>Registered Farmers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <h3>100%</h3>
            <p>Blockchain Secured</p>
          </div>
        </div>
      </div>

      <div className="recent-items">
        <h3>Recent Harvest Items</h3>
        <div className="items-list">
          {stats.recentItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Farmer: {item.farmer}</p>
                <span className="item-date">{item.date}</span>
              </div>
              <div className="item-status">
                <span className="status-badge harvested">Harvested</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h4>Secure & Transparent</h4>
          <p>All transactions are recorded on blockchain ensuring complete transparency and security.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h4>QR Code Tracking</h4>
          <p>Generate QR codes for easy tracking and verification of agricultural products.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌍</div>
          <h4>Global Supply Chain</h4>
          <p>Track products from farm to consumer across the entire supply chain network.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
