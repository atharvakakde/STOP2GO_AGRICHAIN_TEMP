import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const TrackItem = ({ addNotification }) => {
  const [itemId, setItemId] = useState('');
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stateNames = {
    '0': 'Harvested',
    '1': 'For Sale by Farmer',
    '2': 'Purchased by Distributor',
    '3': 'Shipped by Distributor',
    '4': 'Received by Retailer',
    '5': 'For Sale by Retailer',
    '6': 'Purchased by Consumer'
  };

  const handleTrackItem = async (e) => {
    e.preventDefault();
    if (!itemId) return;

    setIsLoading(true);
    setItem(null);

    try {
      const response = await fetch(`http://localhost:5000/item/${itemId}`);
      
      if (response.ok) {
        const itemData = await response.json();
        setItem(itemData);
        addNotification(`📦 Item found: ${itemData.name}`, 'success');
      } else {
        const error = await response.text();
        addNotification(`❌ ${error}`, 'error');
      }
    } catch (error) {
      addNotification(`❌ Network error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return 'Not assigned';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="track-item">
      <div className="page-header">
        <h2>🔍 Track Item</h2>
        <p>Search and verify agricultural products on the blockchain</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleTrackItem} className="search-form">
          <div className="search-input-group">
            <input
              type="number"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Enter Item ID (e.g., 1, 2, 3...)"
              className="search-input"
              min="1"
              required
            />
            <button 
              type="submit" 
              className={`search-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !itemId}
            >
              {isLoading ? (
                <span className="spinner-small"></span>
              ) : (
                <>🔍 Track</>
              )}
            </button>
          </div>
        </form>
      </div>

      {item && (
        <div className="item-details">
          <div className="item-header">
            <div className="item-title">
              <h3>📦 {item.name}</h3>
              <span className={`status-badge ${item.state}`}>
                {stateNames[item.state] || 'Unknown State'}
              </span>
            </div>
            <div className="item-id">
              ID: #{item.id}
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-card">
              <h4>🌍 Product Information</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <strong>Name:</strong>
                  <span>{item.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Origin:</strong>
                  <span>{item.origin}</span>
                </div>
                <div className="detail-item">
                  <strong>Quality:</strong>
                  <span className="quality-badge">{item.quality}</span>
                </div>
                <div className="detail-item">
                  <strong>Price:</strong>
                  <span>{item.price} wei</span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h4>🔗 Supply Chain</h4>
              <div className="supply-chain">
                <div className="chain-step">
                  <div className="step-icon">👨‍🌾</div>
                  <div className="step-info">
                    <strong>Farmer</strong>
                    <span>{formatAddress(item.farmer)}</span>
                  </div>
                </div>

                <div className="chain-arrow">↓</div>

                <div className="chain-step">
                  <div className="step-icon">🚚</div>
                  <div className="step-info">
                    <strong>Distributor</strong>
                    <span>{formatAddress(item.distributor)}</span>
                  </div>
                </div>

                <div className="chain-arrow">↓</div>

                <div className="chain-step">
                  <div className="step-icon">🏪</div>
                  <div className="step-info">
                    <strong>Retailer</strong>
                    <span>{formatAddress(item.retailer)}</span>
                  </div>
                </div>

                <div className="chain-arrow">↓</div>

                <div className="chain-step">
                  <div className="step-icon">👤</div>
                  <div className="step-info">
                    <strong>Consumer</strong>
                    <span>{formatAddress(item.consumer)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-card qr-card">
              <h4>📱 QR Code</h4>
              <div className="qr-section">
                <QRCodeSVG 
                  value={`AgriChain Item #${item.id}: ${item.name} from ${item.origin}`}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#2d5a87"
                  level="M"
                />
                <p className="qr-text">Scan to verify authenticity</p>
              </div>
            </div>
          </div>

          <div className="verification-badge">
            <div className="verification-icon">✅</div>
            <div className="verification-text">
              <strong>Blockchain Verified</strong>
              <p>This item is authentic and traceable on the AgriChain network</p>
            </div>
          </div>
        </div>
      )}

      {!item && !isLoading && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Ready to Track</h3>
          <p>Enter an item ID above to view its complete supply chain history and verify its authenticity.</p>
        </div>
      )}
    </div>
  );
};

export default TrackItem;
