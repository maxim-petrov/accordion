import React from 'react';
import './App.css';
import Component from './component/Component.jsx';
import ComponentConfig from './component/ComponentConfig.jsx';
import { TokenProvider } from './component/context/TokenContext';

function App() {
  return (
    <TokenProvider>
      <div style={{ padding: '40px', backgroundColor: '#f0f5f8', borderRadius: '20px' }}>
        <Component />
        <Component />
        <Component />
      </div>
      <ComponentConfig />
    </TokenProvider>
  );
}

export default App;