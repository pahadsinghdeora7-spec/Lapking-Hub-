import React from 'react';

export default function Account() {
  const fullName = 'Pahadsingh Deora';
  const email = 'pahadsinghdeora23@gmail.com';

  return (
    <div className="page">
      <div className="profile-card">
        <div className="avatar-circle">P</div>
        <div>
          <div className="profile-name">{fullName}</div>
          <div className="profile-email">{email}</div>
        </div>
      </div>

      <div className="card list-card">
        <button className="list-item">
          <span>My Orders</span>
          <span className="material-icons">chevron_right</span>
        </button>
        <button className="list-item">
          <span>Returns & Cancellations</span>
          <span className="material-icons">chevron_right</span>
        </button>
        <button
          className="list-item"
          onClick={() => {
            // yahi se admin panel URL open kara sakte hain
            window.location.href = '/admin'; // agar alag route banaya ho
          }}
        >
          <span>Admin Dashboard</span>
          <span className="material-icons">chevron_right</span>
        </button>
      </div>

      <button className="logout-btn">Logout</button>
    </div>
  );
        }
