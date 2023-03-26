import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import Navbar from './Components/Navbar/Navbar';
import Transactions from './Containers/Transactions/Transactions';
import Home from './Containers/Home/Home';
import Charts from './Containers/Charts/Charts';
import NetWorth from './Containers/NetWorth/NetWorth';

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
	const [netWorth, setNetWorth] = useState([]);
	const [monthlySummaries, setMonthlySummaries] = useState({});
	const [tab, setTab] = useState('home');

  	useEffect(() => {
    	getAndSetTransactions();
		getAndSetNetWorth();
  	}, []);

	useEffect(() => {
		extractPast12MonthsTransactions();
    }, [transactions]);

	const getAndSetTransactions = () => {
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
	}

	const getAndSetNetWorth = () => {
		axios.get(`${process.env.REACT_APP_NODE_SERVER}/net-worth`,
		{
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		}
		).then(function (response) {
			setNetWorth([...response.data.items]);
		})
		.catch(function (error) {
			console.log(error);
		});;
	}

	const extractPast12MonthsTransactions = () => {
        const today = dayjs();
        const monthlySummaries = {};

		for (const transaction of transactions) {
			const date = dayjs(transaction.date).format('MM-YYYY');
			if (!(date in monthlySummaries)) {
				monthlySummaries[date] = {
					"Rent": 0,
					"Electricity": 0,
					"Internet": 0,
					"Home Supplies": 0,
					"Groceries": 0,
					"Dining Out": 0,
					"Phone": 0,
					"Car": 0,
					"Car Insurance": 0,
					"Subscriptions": 0,
					"Personal stuff": 0,
					"Cat": 0,
					"Gas": 0,
					"Gaming": 0,
					"Cloths": 0,
					"Gym": 0,
					"Transit": 0,
					"Vacation": 0,
					"Loans / Fees": 0,
					'total': 0,
					'date': dayjs(transaction.date).startOf('month')
				};
			}
			monthlySummaries[date][transaction.category] = monthlySummaries[date][transaction.category] + parseFloat(transaction.cost.replace(',',''));
			monthlySummaries[date]['total'] = monthlySummaries[date]['total'] + parseFloat(transaction.cost.replace(',',''));
		}

        setMonthlySummaries(monthlySummaries);
	}

	const getContents = () => {
		switch (tab) {
			case 'home':
				return <Home
					transactions={transactions}
					monthlySummaries={monthlySummaries}
					categories={categories}
				/>;
			case 'transactions':
				return <Transactions rawTransactions={transactions}/>;
			case 'charts':
				return <Charts
					transactions={transactions}
					monthlySummaries={monthlySummaries}
					categories={categories}  
				/>;
			case 'netWorth':
				return <NetWorth
					netWorth={netWorth}
				/>
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
