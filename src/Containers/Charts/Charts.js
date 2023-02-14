import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell  from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { StyledTableCell, StyledTableRow } from '../../Objects/TableStyler';
import StackedLineChart from '../../Components/StackedLineChart/StackedLineChart';

export default function Charts(props) {

    const [past12MonthsTransactions, setPast12MonthsTransactions] = useState([]);

    useEffect(() => {
        let past12Months = [];
        const today = dayjs();

        for (let i = 0; i < 12; ++i) {
           const month = today.subtract(i, 'month');

            if (month.format('MM-YYYY') in props.monthlySummaries) {
                past12Months.push(props.monthlySummaries[month.format('MM-YYYY')]);
            } else {
                past12Months.push({
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
                    "total": 0,
                    'date': month.startOf('month')
				});
            }
        };
        console.log(past12Months);
        setPast12MonthsTransactions(past12Months);
            
    }, []);

    return (
        <div>
            <TableContainer sx={{paddingTop: 5, width: '80%', margin: 'auto'}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Category</StyledTableCell>
                            {past12MonthsTransactions.map((monthlyTransactions) => (
                                <StyledTableCell key={`category-table-${monthlyTransactions['date'].format('M/D/YYYY')}`}>
                                    {monthlyTransactions['date'].format('MMMM, YYYY')}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.categories.map((row) => (
                            <StyledTableRow
                                key={row}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row}</TableCell>
                                {past12MonthsTransactions.map((monthlyTransactions) => (
                                    <StyledTableCell key={`main-table-${monthlyTransactions['date'].format('M/D/YYYY')}`}>{
                                        `$${monthlyTransactions[row] === 0 ? " -----" : monthlyTransactions[row].toFixed(0)}`
                                    }</StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                        <StyledTableRow
                            key='category-summary-total'
                            sx={{ '&:last-child td, &:last-child th': { border: 0, 'font-weight': 'bold' } }}
                        >
                            <TableCell>Total Spend</TableCell>
                            {past12MonthsTransactions.map((monthlyTransactions) => (
                                <TableCell key={`total-table-${monthlyTransactions['date'].format('M/D/YYYY')}`}>
                                    {`$${monthlyTransactions['total'] === "" ? " -----" : monthlyTransactions['total'].toFixed(0)}`}
                                </TableCell>
                            ))}
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h3>Past 12 Months Transactions</h3>
            <StackedLineChart
                past12MonthsTransactions={past12MonthsTransactions}
                categories={props.categories}            
            />
        </div>
    )
}