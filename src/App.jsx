import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Categories from './pages/Categories.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Account from './pages/Account.jsx';

function Header() {
  return (
    <header className="app-header">
      <div className="logo-row">
        <button className="icon-button">
          <span className="material-icons">menu</span>
        </button>
        <div className="logo-wrap">
          <div className="logo-icon">👑</div>
          <span className="logo-text">
            Lapking<span className="logo-text-bold">Hub</span>
          </span>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <span className="material-icons">favorite_border</span>
          </button>
          <button className="icon-button">
            <span className="material-icons">shopping_cart</span>
          </button>
        </div>
      </div>

      <div className="search-wrap">
        <span className="material-icons search-icon">search</span>
        <input
          className="search-input"
          placeholder="Search products..."
        />
      </div>
    </header>
  );
}

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (p) => (path === p ? 'bn-item active' : 'bn-item');

  return (
    <nav className="bottom-nav">
      <Link to="/" className={isActive('/')}>
        <span className="material-icons">home</span>
        <span>Home</span>
      </Link>
      <Link to="/categories" className={isActive('/categories')}>
        <span className="material-icons">apps</span>
        <span>Categories</span>
      </Link>
      <Link to="/cart" className={isActive('/cart')}>
        <span className="material-icons">shopping_cart</span>
        <span>Cart</span>
      </Link>
      <Link to="/orders" className={isActive('/orders')}>
        <span className="material-icons">inventory_2</span>
        <span>Orders</span>
      </Link>
      <Link to="/account" className={isActive('/account')}>
        <span className="material-icons">person</span>
        <span>Account</span>
      </Link>
    </nav>
  );
}

function WhatsAppButton() {
  const whatsappNumber = '9873670361'; // aapka number
  const message = encodeURIComponent('Hi, I want to enquire about Lapking Hub products.');
  const url = `https://wa.me/91${whatsappNumber}?text=${message}`;

  return (
    <a href={url} target="_blank" rel="noreferrer" className="wa-fab">
      💬
    </a>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <Header />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>

        <BottomNav />
        <WhatsAppButton />
      </div>
    </Router>
  );
}
