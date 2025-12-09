function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#0f172a',
        color: 'white',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Lapking Hub</h1>
      <p style={{ fontSize: '16px', maxWidth: '420px', opacity: 0.85 }}>
        B2B laptop &amp; computer accessories app.
        <br />
        Basic version deployed ✔️  
        Full product listing + admin + WhatsApp order workflow coming next.
      </p>
    </div>
  );
}

export default App;
