import React, {useState} from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import dayjs from 'dayjs';
import axios from 'axios';
import _ from 'lodash';

import { StyledTableCell, StyledMinorTableCell, StyledTableRow } from '../../Objects/TableStyler';

const NetWorthCategory = {
    cash: 'cash',
    tfsa: 'TFSA',
    rrsp: 'RRSP',
    fhsa: 'FHSA',
    investments: 'investments'
}

export default function NetWorth(props) {
    const [type, setType] = useState("asset");
    const [category, setCategory] = useState("cash");
    const [person, setPerson] = useState("Ryan");
    const [name, setName] = useState("");
    const [value, setValue] = useState("");

    const onTypeChange = (e) => {
        setType(e.target.value);
    };

    const onCategoryChange = (e) => {
        setCategory(e.target.value);
    };
    
    const onPersonChange = (e) => {
        setPerson(e.target.value);
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    }

    const onValueChange = (e) => {
        setValue(e.target.value);
    }

    const postButtonClicked = () => {
        const today = dayjs().format('DD-MM-YYYY');
        axios.post(`${process.env.REACT_APP_NODE_SERVER}/net-worth`,
            {
                'items': [
                    {
                        itemId: [person, type, category, name, value, today].join(''),
                        type,
                        category,
                        person,
                        name,
                        value,
                        date: today
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        ).then(function (response) {
            setName("");
            setValue("");
        }).catch(function (error) {
            console.log(error);
        });
    }

    const createRows =  (category) => {
        const groupBy = _.groupBy(props.netWorth.filter(d => d.category === NetWorthCategory[category]), d => d.name);
        const rows = _.keys(groupBy).map(d => _.last(_.sortBy(groupBy[d], r => r.date)));
        let total = 0;
        _.forEach(rows, row => {
            total = total + parseFloat(row.value)
        })

        return rows.map((row) => (
            <StyledTableRow
                key={row.itemId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell></TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.person}</TableCell>
                <TableCell>{`$${row.value === 0 ? " -----" : row.value}`}</TableCell>
            </StyledTableRow>
        ));
    }

    return (
        <div>
            <Box sx={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, textAlign: 'left', display: 'flex' }}>
                <FormControl fullWidth sx={{ width: 150, textAlign: 'left' }}>
                    <InputLabel id="net-worth-type-input-label">Type</InputLabel>
                        <Select
                            labelId="net-worth-type-select-label"
                            id="net-worth-type-select"
                            value={type}
                            label="Type"
                            onChange={onTypeChange}
                        >
                            <MenuItem value={'asset'}>Asset</MenuItem>
                            <MenuItem value={'liability'}>Liability</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginLeft: 2, width: 150, textAlign: 'left' }}>
                    <InputLabel id="net-worth-category-input-label">Category</InputLabel>
                        <Select
                            labelId="net-worth-category-select-label"
                            id="net-worth-category-select"
                            value={category}
                            label="Category"
                            onChange={onCategoryChange}
                        >
                            <MenuItem value={NetWorthCategory.cash}>Cash</MenuItem>
                            <MenuItem value={NetWorthCategory.tfsa}>TFSA</MenuItem>
                            <MenuItem value={NetWorthCategory.rrsp}>RRSP</MenuItem>
                            <MenuItem value={NetWorthCategory.fhsa}>FHSA</MenuItem>
                            <MenuItem value={NetWorthCategory.investments}>Investments</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginLeft: 2, width: 150, textAlign: 'left' }}>
                    <InputLabel id="net-worth-person-input-label">Person</InputLabel>
                        <Select
                            labelId="net-worth-person-select-label"
                            id="net-worth-person-select"
                            value={person}
                            label="Person"
                            onChange={onPersonChange}
                        >
                            <MenuItem value={'Ryan'}>Ryan</MenuItem>
                            <MenuItem value={'Cecilia'}>Cecilia</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginLeft: 2, width: 500, textAlign: 'left' }}>
                    <TextField fullWidth label="Name" id="net-worth-name-text-field" value={name} onChange={onNameChange}/>
                </FormControl>
                <FormControl fullWidth sx={{ marginLeft: 2, width: 200, textAlign: 'left' }}>
                    <TextField fullWidth label="Value" id="net-worth-value-text-field" value={value} onChange={onValueChange}/>
                </FormControl>
                <Button variant="outlined" component="label" sx={{ marginLeft: 2, height: "3.5rem", borderColor: "#192841", color: "#192841"}} onClick={postButtonClicked}>
                    Upload
                </Button>
            </Box>
            <div>
            <h3>Net Worth</h3>
                <TableContainer sx={{width: '40%', margin: 'auto'}}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Category</StyledTableCell>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Person</StyledTableCell>
                                <StyledTableCell>Amount</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Cash</TableCell>
                            </TableRow>
                            {createRows(NetWorthCategory.cash)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}