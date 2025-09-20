import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🌱</span>
              <span className="logo-text">AgriChain</span>
            </div>
            <p>Secure, transparent agricultural supply chain tracking powered by blockchain technology.</p>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Blockchain Security</li>
              <li>Supply Chain Tracking</li>
              <li>QR Code Verification</li>
              <li>Farmer Registration</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Technology</h4>
            <ul>
              <li>Ethereum Blockchain</li>
              <li>Smart Contracts</li>
              <li>React Frontend</li>
              <li>Node.js Backend</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <span>🌐 Web</span>
              <span>📧 Email</span>
              <span>💼 LinkedIn</span>
              <span>🐦 Twitter</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 AgriChain. All rights reserved. | Powered by Blockchain Technology</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
