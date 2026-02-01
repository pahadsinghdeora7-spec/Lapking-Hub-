import { useLoader } from "../context/LoaderContext";
import "./GlobalLoader.css";

export default function GlobalLoader() {
  const { loading } = useLoader();

  // ❌ loading false → kuch bhi mat dikhao
  if (!loading) return null;

  return (
    <div className="global-loader">
      <div className="loader-box">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
