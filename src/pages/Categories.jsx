import React from 'react';

export default function Categories() {
  // Abhi static cards, baad me Supabase se categories nikaal sakte hain
  const cats = [
    { name: 'Chargers' },
    { name: 'Keyboards' },
    { name: 'Mouse' },
    { name: 'HDMI Cables' },
    { name: 'Batteries' },
    { name: 'Adapters' },
  ];

  return (
    <div className="page">
      <h3 className="section-title">All Categories</h3>
      <div className="categories-grid">
        {cats.map((c) => (
          <div key={c.name} className="category-card">
            <div className="category-icon">🔌</div>
            <div className="category-name">{c.name}</div>
            <div className="category-link">Shop Now →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
