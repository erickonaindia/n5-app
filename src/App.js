import React from 'react';
import Navbar from './components/Navbar';
import DataGridComponent from './components/DataGrid';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />  
      <div className="container">
        <DataGridComponent />
      </div>
    </div>
  );
}

export default App;
