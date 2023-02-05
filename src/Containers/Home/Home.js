import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { StyledTableCell, StyledTableRow } from '../../Objects/TableStyler';
  
export default function Home(props) {
    const [date, setDate] = useState(dayjs().subtract(1,'months'));
    const [dateFilteredTransactions, setDateFilteredTransactions] = useState([]);
    const [categorySummaries, setCategoriesSummaries] = useState({
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
        "Loans / Fees": 0
    });
    const [totalSpend, setTotalSpend] = useState(0);

    useEffect(() => {
        const filteredTransactions = [...props.transactions].filter(
            t => dayjs(t.date).month() === date.month() && dayjs(t.date).year() === date.year())
        setDateFilteredTransactions(filteredTransactions);
        
        for(const category in categorySummaries) {
            categorySummaries[category] = 0;
        }
        let totalSpendTemp = 0;
        for (const transaction of filteredTransactions) {
            categorySummaries[transaction.category] = categorySummaries[transaction.category] + parseFloat(transaction.cost.replace(',',''));
            totalSpendTemp = totalSpendTemp + parseFloat(transaction.cost.replace(',',''));
        }
        setTotalSpend(totalSpendTemp);

    }, [props.transactions, date]);


    return (
        <div>
            <h2>Recent Transactions</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    views={['year', 'month']}
                    label="Year and Month"
                    minDate={dayjs('2022-05-01')}
                    maxDate={dayjs('2023-12-01')}
                    value={date}
                    onChange={(newValue) => {
                        setDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} helperText={null} />}
                />
            </LocalizationProvider>
            <h3>Summary</h3>
            <TableContainer sx={{paddingLeft: 10, paddingRight: 10, width: '40%'}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell>Total</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.categories.map((row) => (
                            <StyledTableRow
                                key={row}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row}</TableCell>
                                <TableCell>{`$${categorySummaries[row] === 0 ? " -----" : categorySummaries[row].toFixed(2)}`}</TableCell>
                            </StyledTableRow>
                        ))}
                        <StyledTableRow
                                key='category-summary-total'
                                sx={{ '&:last-child td, &:last-child th': { border: 0, 'font-weight': 'bold' } }}
                            >
                                <TableCell>Total Spend</TableCell>
                                <TableCell>{`$${totalSpend === 0 ? " -----" : totalSpend.toFixed(2)}`}</TableCell>
                        </StyledTableRow>

                    </TableBody>
                </Table>
            </TableContainer>
            <h3>Transactions</h3>
            <TableContainer sx={{paddingLeft: 10, paddingRight: 10, width: '60%'}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Income</StyledTableCell>
                            <StyledTableCell>Cost</StyledTableCell>
                            <StyledTableCell>Category</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {dateFilteredTransactions.map((row) => (
                        <StyledTableRow
                            key={row.transaction}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.desc}</TableCell>
                            <TableCell>{`$${row.income === "" ? " -----" : row.income}`}</TableCell>
                            <TableCell>{`$${row.cost === "" ? " -----" : row.cost}`}</TableCell>
                            <TableCell>{row.category}</TableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
        </div>
    );
};