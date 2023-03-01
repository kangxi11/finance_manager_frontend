import React, {useState} from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import dayjs from 'dayjs';
import axios from 'axios';

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
                        today
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
                            <MenuItem value={'cash'}>Cash</MenuItem>
                            <MenuItem value={'TFSA'}>TFSA</MenuItem>
                            <MenuItem value={'RRSP'}>RRSP</MenuItem>
                            <MenuItem value={'investments'}>Investments</MenuItem>
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
        </div>
    )
}