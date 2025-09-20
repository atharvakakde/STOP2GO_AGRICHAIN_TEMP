import React, { useState } from 'react';

const AddFarmer = ({ accounts, addNotification }) => {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFarmer = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/addfarmer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: selectedAccount
        })
      });

      if (response.ok) {
        const result = await response.text();
        addNotification(`✅ ${result}`, 'success');
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
    <div className="add-farmer">
      <div className="page-header">
        <h2>🧑‍🌾 Add New Farmer</h2>
        <p>Register a new farmer account on the blockchain</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleAddFarmer} className="farmer-form">
          <div className="form-group">
            <label htmlFor="account">Select Farmer Account</label>
            <select 
              id="account"
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="form-select"
              required
            >
              {accounts.map((account, index) => (
                <option key={account} value={account}>
                  Account {index + 1}: {account}
                </option>
              ))}
            </select>
            <small className="form-help">Choose an Ethereum account to register as a farmer</small>
          </div>

          <div className="account-preview">
            <h4>Selected Account Details</h4>
            <div className="account-details">
              <div className="account-item">
                <strong>Address:</strong> 
                <span className="account-address">{selectedAccount}</span>
              </div>
              <div className="account-item">
                <strong>Status:</strong> 
                <span className="status-pending">Ready to Register</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Adding Farmer...
              </>
            ) : (
              <>
                <span>👨‍🌾</span>
                Add Farmer
              </>
            )}
          </button>
        </form>

        <div className="info-section">
          <h4>ℹ️ What happens when you add a farmer?</h4>
          <ul className="info-list">
            <li>The selected account will be registered on the blockchain</li>
            <li>The farmer will be able to harvest and sell agricultural products</li>
            <li>All transactions will be permanently recorded and traceable</li>
            <li>The farmer gains access to the AgriChain network</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddFarmer;
