import React from 'react';
import './Navbar.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function Navbar(props) {

    const handleClick = (newTab) => {
        props.setTab(newTab);
    }

    return (
        <AppBar position="static">
        <Toolbar className="navbar">
            <div className="navbar-buttons">
                <ButtonGroup variant="text" aria-label="text button group">
                    <Button
                        className={props.tab === 'home' ? 'navbar-button navbar-selected-button' : 'navbar-button'}
                        color="inherit"
                        onClick={() => handleClick("home")}
                    >
                        Home
                    </Button>
                    <Button 
                        className={props.tab === 'transactions' ? 'navbar-button navbar-selected-button' : 'navbar-button'} 
                        color="inherit" 
                        onClick={() => handleClick("transactions")}
                    >
                        Transactions
                    </Button>
                    <Button 
                        className={props.tab === 'charts' ? 'navbar-button navbar-selected-button' : 'navbar-button'}
                        color="inherit" 
                        onClick={() => handleClick("charts")}
                    >
                        Charts
                    </Button>
                </ButtonGroup>
            </div>
        </Toolbar>
        </AppBar>
    );
};