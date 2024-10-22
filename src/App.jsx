import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from"./components/layouts/Header.jsx";
import Sidebar from"./components/layouts/Sidebar.jsx";


function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <h1>Content Area</h1>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
