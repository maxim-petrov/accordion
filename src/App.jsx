import React from 'react';
import './App.css';
import Component from './component/Component.jsx';
import ComponentConfig from './component/ComponentConfig.jsx';
import { TokenProvider } from './component/context/TokenContext';

function App() {
  return (
    <TokenProvider>
      <Component />
      <ComponentConfig />
    </TokenProvider>
  );
}

export default App;