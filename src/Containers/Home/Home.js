import React, {useEffect, useState} from 'react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Home(props) {
    const [date, setDate] = useState(dayjs('2022-12-01'));

    return (
        <div>
            <h2>Recent Transactions</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    views={['year', 'month']}
                    label="Year and Month"
                    minDate={dayjs('2022-01-01')}
                    maxDate={dayjs('2023-12-01')}
                    value={date}
                    onChange={(newValue) => {
                        setDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} helperText={null} />}
                />
            </LocalizationProvider>
            <TableContainer component={Paper} sx={{paddingLeft: 50, paddingRight: 50, width: '60%'}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Income</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Category</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {[...props.transactions].filter(t => dayjs(t.date).month() === date.month() && dayjs(t.date).year() === date.year()).map((row) => (
                        <TableRow
                            key={row.transaction}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.desc}</TableCell>
                            <TableCell>{`$${row.income}`}</TableCell>
                            <TableCell>{`$${row.cost}`}</TableCell>
                            <TableCell>{row.category}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
        </div>
    );
};