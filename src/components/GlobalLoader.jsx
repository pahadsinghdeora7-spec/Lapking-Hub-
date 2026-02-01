import "./GlobalLoader.css";

export default function GlobalLoader() {
  return (
    <div className="global-loader">
      <div className="loader-box">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
