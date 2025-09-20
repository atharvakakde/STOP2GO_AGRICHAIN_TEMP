import React, { useState } from 'react';

const HarvestItem = ({ accounts, addNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    price: '',
    quality: '',
    account: accounts[0]
  });
  const [isLoading, setIsLoading] = useState(false);

  const qualityOptions = [
    'Premium', 'Grade A', 'Grade B', 'Organic', 'Fair Trade', 'Local Grown'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/harvest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.text();
        addNotification(`🌾 ${result}`, 'success');
        // Reset form
        setFormData({
          name: '',
          origin: '',
          price: '',
          quality: '',
          account: accounts[0]
        });
      } else {
        const error = await response.text();
        addNotification(`❌ Error: ${error}`, 'error');
      }
    } catch (error) {
      addNotification(`❌ Network error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="harvest-item">
      <div className="page-header">
        <h2>🌾 Harvest New Item</h2>
        <p>Record a new agricultural product on the blockchain</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="harvest-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Organic Tomatoes"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="origin">Origin Location *</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="e.g., Maharashtra, India"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (in Wei) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 1000"
                className="form-input"
                min="1"
                required
              />
              <small className="form-help">1 ETH = 1,000,000,000,000,000,000 wei</small>
            </div>

            <div className="form-group">
              <label htmlFor="quality">Quality Grade *</label>
              <select
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select Quality</option>
                {qualityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="account">Farmer Account *</label>
            <select
              id="account"
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              {accounts.map((account, index) => (
                <option key={account} value={account}>
                  Account {index + 1}: {account}
                </option>
              ))}
            </select>
            <small className="form-help">Make sure this account is registered as a farmer</small>
          </div>

          <div className="harvest-preview">
            <h4>📋 Harvest Preview</h4>
            <div className="preview-grid">
              <div className="preview-item">
                <strong>Product:</strong> {formData.name || 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Origin:</strong> {formData.origin || 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Price:</strong> {formData.price ? `${formData.price} wei` : 'Not specified'}
              </div>
              <div className="preview-item">
                <strong>Quality:</strong> {formData.quality || 'Not selected'}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !formData.name || !formData.origin || !formData.price || !formData.quality}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Recording Harvest...
              </>
            ) : (
              <>
                <span>🌾</span>
                Record Harvest
              </>
            )}
          </button>
        </form>

        <div className="harvest-info">
          <h4>🔐 Blockchain Benefits</h4>
          <ul className="info-list">
            <li>Immutable record of harvest data</li>
            <li>Transparent supply chain tracking</li>
            <li>Proof of origin and quality</li>
            <li>Secure farmer identity verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HarvestItem;
