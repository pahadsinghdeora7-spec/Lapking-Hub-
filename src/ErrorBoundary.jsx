import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("🔥 APP CRASHED:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: "20px",
          color: "red",
          fontSize: "16px",
          whiteSpace: "pre-wrap"
        }}>
          <h2>❌ Lapking Hub Crashed</h2>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
