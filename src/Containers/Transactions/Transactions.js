import React from 'react';
import Button from '@mui/material/Button';
import papaparse from 'papaparse';
import {CIBCTransaction, AMEXTransaction} from '../../Objects/Transaction';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from '@mui/material/Select';
import _ from 'lodash';
import axios from 'axios';

  
export default function Transactions(props) {

    const [transactions, setTransactions] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [transactionType, setTransactionType] = React.useState('CIBC');
    let rowsDeleted = [];

    async function onFileChange(e) {
        await parseCSV(e.target.files[0]);
    }

    async function parseCSV(file) {
        await new Promise((resolve, reject) => papaparse.parse(file, {
            header: false,
            complete: function(results) {
                // read the data from results
                const { data } = results;
                let tempTransactions = [];
                let tempCategories = [];
                data.forEach( d => {
                    if (d.length > 1) {
                        if (transactionType === 'CIBC') {
                            tempTransactions.push(new CIBCTransaction(d));
                            tempCategories.push("");
                        }
                        if (transactionType === 'AMEX') {
                            if (new Date(d[0]).toString() !== "Invalid Date") {
                                tempTransactions.push(new AMEXTransaction(d));
                                tempCategories.push("");
                            }
                        }
                    }
                });
                resolve({tempTransactions, tempCategories});
            }
        })).then(
            results => {
                setTransactions([...results.tempTransactions]);
                setCategories([...results.tempCategories]);
            }
        ).catch(//log the error
            err=>console.warn("Something went wrong:",err)
        )
    }

    const deleteTransactionFromTable = (id) => {
        if (rowsDeleted.includes(id)) {
            _.remove(rowsDeleted, (d) => d === id);
        } else {
            rowsDeleted.push(id);
        }
    }

    const handleCatgegoryChange = (category, i) => {
        categories[i] = category;
        setCategories([...categories]);
        
        transactions[i].setCategory(category);
    }

    const onTransactionTypeChange = (e) => {
        setTransactionType(e.target.value);
      };    

    const postButtonClicked = () => {
        axios.post('http://localhost:3000/transactions',
            {
                'transactions': [
                    ...transactions.map(t => t.getJSON())
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        ).then(function (response) {
            setTransactions([]);
            setCategories([]);
        })
        .catch(function (error) {
            console.log(error);
        });;
    }

    const getTransactions = () => {
        return transactions.map((t, i) => (
            <TableRow
                key={t.getId()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        onChange={() => deleteTransactionFromTable(i)}
                    />
                </TableCell>
                <TableCell component="th" scope="row">
                    {t.getDate()}
                </TableCell>
                <TableCell>{t.getDesc()}</TableCell>
                <TableCell>{`$${t.getIncome()}`}</TableCell>
                <TableCell>{`$${t.getCost()}`}</TableCell>
                <TableCell>
                    <Select
                        labelId="transaction-category"
                        id="select-transaction-category"
                        value={categories[i]}
                        onChange={(e) => handleCatgegoryChange(e.target.value, i)}
                        label="Category"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'Rent'}>Rent</MenuItem>
                        <MenuItem value={'Electricity'}>Electricity</MenuItem>
                        <MenuItem value={'Internet'}>Internet</MenuItem>
                        <MenuItem value={'Home Supplies'}>Home Supplies</MenuItem>
                        <MenuItem value={'Groceries'}>Groceries</MenuItem>
                        <MenuItem value={'Dining Out'}>Dining Out</MenuItem>
                        <MenuItem value={'Phone'}>Phone</MenuItem>
                        <MenuItem value={'Car'}>Car</MenuItem>
                        <MenuItem value={'Car Insurance'}>Car Insurance</MenuItem>
                        <MenuItem value={'Gas'}>Gas</MenuItem>
                        <MenuItem value={'Subscriptions'}>Subscriptions</MenuItem>
                        <MenuItem value={'Personal stuff'}>Personal stuff</MenuItem>
                        <MenuItem value={'Cat'}>Cat</MenuItem>
                        <MenuItem value={'Gaming'}>Gaming</MenuItem>
                        <MenuItem value={'Cloths'}>Cloths</MenuItem>
                        <MenuItem value={'Gym'}>Gym</MenuItem>
                        <MenuItem value={'Transit'}>Transit</MenuItem>
                        <MenuItem value={'Vacation'}>Vacation</MenuItem>
                        <MenuItem value={'Loans / Fees'}>Loans / Fees</MenuItem>
                    </Select>
                </TableCell>
            </TableRow>
        ));
    }

    const deleteButtonClicked = () => {
        setTransactions(_.remove(transactions, (d, i) => !rowsDeleted.includes(i)));
        rowsDeleted = [];
    }

    return (
        <div>
            <Button variant="contained" component="label">
                Upload
                <input hidden accept=".csv, xls" multiple type="file" onChange={onFileChange}/>
            </Button>
            <Box sx={{ minWidth: 150, marginTop: 3 }}>
                <FormControl>
                    <InputLabel id="transaction-type-select-input-label">Type</InputLabel>
                        <Select
                            labelId="transaction-type-select-label"
                            id="transaction-type-select"
                            value={transactionType}
                            label="Transaction Type"
                            onChange={onTransactionTypeChange}
                        >
                            <MenuItem value={'CIBC'}>CIBC</MenuItem>
                            <MenuItem value={'AMEX'}>AMEX</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <TableContainer component={Paper} sx={{paddingLeft: 50, paddingRight: 50, width: '60%'}}>
                <Table sx={{ minWidth: 100 }} size="small" aria-label="transactions table">
                    <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Income</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Category</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {getTransactions()}
                    </TableBody>
                </Table>
                <div>
                    <Button variant="contained" component="label" color="error" onClick={deleteButtonClicked}>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Button>
                    <Button variant="contained" component="label" color="success" onClick={postButtonClicked}>
                        Add
                    </Button>
                </div>
            </TableContainer>
        </div>
    );
};