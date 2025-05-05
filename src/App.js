import React from "react";
import Chatbot from "./Chatbot";
import './App.css';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Avani Organics Chatbot</h1>
      </header>
      <main className="app-main">
        <Chatbot />
      </main>
    </div>
  );
};

export default App;