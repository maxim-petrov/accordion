import React from 'react';
import './App.css';
import Component from './component/Component.jsx';
import ComponentConfig from './component/ComponentConfig.jsx';
import { TokenProvider } from './component/context/TokenContext';

function App() {
  // Detailed content for the first accordion
  const detailedContent = (
    <p>
      Документ, на основании которого нынешний владелец квартиры приобрёл право собственности на указанное жилое помещение.
    </p>
  );

  // Shorter content for the second accordion
  const shortContent1 = (
    <p>
      Документ, подтверждающий право собственности на квартиру (договор купли-продажи, 
      договор долевого участия, договор дарения, свидетельство о праве на наследство и др.). 
      Хранится у собственника и предъявляется при совершении сделок с недвижимостью.
    </p>
  );

  // Shorter content for the third accordion
  const shortContent2 = (
    <p>
      Документ, на основании которого текущий владелец приобрел право собственности на квартиру. 
      Включает договор купли-продажи, дарения, долевого участия или другие документы, 
      установленные законодательством.
    </p>
  );

  return (
    <TokenProvider>
      <div className="component-container">
        <Component 
          title="Правоустанавливающий документ" 
          subtitle="Подтверждение права собственности"
          content={detailedContent}
        />
        <Component 
          title="Правоустанавливающий документ" 
          subtitle="Краткое описание"
          content={shortContent1}
        />
        <Component 
          title="Документ о праве собственности" 
          subtitle="Основание владения"
          content={shortContent2}
        />
      </div>
      <ComponentConfig />
    </TokenProvider>
  );
}

export default App;