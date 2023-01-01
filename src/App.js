import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './Components/Navbar/Navbar';
import Transactions from './Containers/Transactions/Transactions';
import Home from './Containers/Home/Home';

function App() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/transactions',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
            ).then(function (response) {
                const temp = response.data.transactions.sort(
                    (d1, d2) => new Date(d2.date).getTime() - new Date(d1.date).getTime()
                );
                setTransactions([...temp]);
            })
            .catch(function (error) {
                console.log(error);
            });;
        }, []);

  const [tab, setTab] = useState('home');

  const getContents = () => {
    switch (tab) {
      case 'home':
        return <Home transactions={transactions}/>;
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
