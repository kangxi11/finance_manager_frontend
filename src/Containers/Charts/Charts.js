import React, {useEffect, useState} from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell  from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

import { StyledTableCell, StyledTableRow } from '../../Objects/TableStyler';

export default function Charts(props) {
    const [past12MonthsTransactions, setPast12MonthsTransactions] = useState([]);

    useEffect(() => {
        const today = dayjs();
        const past12Months = [];

        for (let i = 0; i < 12; ++i) {
            const monthSummary = {};
            monthSummary['date'] = today.subtract(i, 'month');    

            for(const j in props.categories) {
                monthSummary[props.categories[j]] = 0;
            }
            monthSummary['total'] = 0;

            past12Months.push(monthSummary);
        }

        for (const transaction of props.transactions) {
            for (const i in past12Months) {
                if (past12Months[i]['date'].year() === dayjs(transaction.date).year()
                    && past12Months[i]['date'].month() === dayjs(transaction.date).month()
                ) {
                    past12Months[i][transaction.category] = past12Months[i][transaction.category] + parseFloat(transaction.cost.replace(',',''));
                    past12Months[i]['total'] = past12Months[i]['total'] + parseFloat(transaction.cost.replace(',',''));
                }
            }
        }

        setPast12MonthsTransactions(past12Months);
    }, []);

    return (
        <div>
            <TableContainer sx={{paddingLeft: 5, paddingRight: 5, paddingTop: 5, width: '80%'}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Category</StyledTableCell>
                            {past12MonthsTransactions.map((monthlyTransactions) => (
                                <StyledTableCell key={monthlyTransactions['date'].format('M/D/YYYY')}>{monthlyTransactions['date'].format('MMMM, YYYY')}</StyledTableCell>
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
                                    <StyledTableCell key={monthlyTransactions['date'].format('M/D/YYYY')}>{
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
                                <TableCell>{`$${monthlyTransactions['total'] === "" ? " -----" : monthlyTransactions['total'].toFixed(0)}`}</TableCell>
                            ))}
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}