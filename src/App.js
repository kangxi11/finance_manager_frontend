import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import Navbar from './Components/Navbar/Navbar';
import Transactions from './Containers/Transactions/Transactions';
import Home from './Containers/Home/Home';

function App() {

  const [tab, setTab] = useState('home');

  const getContents = () => {
    switch (tab) {
      case 'home':
        return <Home />;
      case 'transactions':
        return <Transactions />;
      default:
        break;
    }
  }


  return (
    <div className="App">
      <Navbar
        tab={tab}
        setTab={setTab}
      />
      <div>
        {getContents()}
      </div>
    </div>
  );
}

export default App;
