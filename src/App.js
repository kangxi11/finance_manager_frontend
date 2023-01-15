import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './Components/Navbar/Navbar';
import Transactions from './Containers/Transactions/Transactions';
import Home from './Containers/Home/Home';
import Charts from './Containers/Charts/Charts';

const categories = [
  "Rent",
  "Electricity",
  "Internet",
  "Home Supplies",
  "Groceries",
  "Dining Out",
  "Phone",
  "Car",
  "Car Insurance",
  "Subscriptions",
  "Personal stuff",
  "Cat",
  "Gas",
  "Gaming",
  "Cloths",
  "Gym",
  "Transit",
  "Vacation",
  "Loans / Fees"
];

function App() {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_NODE_SERVER}/transactions`,
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
        return <Home
          transactions={transactions}
          categories={categories}
        />;
      case 'transactions':
        return <Transactions />;
      case 'charts':
        return <Charts
          transactions={transactions}
          categories={categories}  
        />;
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
