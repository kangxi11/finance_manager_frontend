import React, {useEffect, useState} from 'react';
import * as d3 from 'd3';

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

    useEffect(() => {
        createLineGraph();
    }, [past12MonthsTransactions]);

    const createLineGraph = async () => {
        var margin = { top: 20, right: 20, bottom: 50, left: 70 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
        let svg = d3.select("#line-graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},     ${margin.top})`);

        // Add X axis and Y axis
        var x = d3.scaleTime()
            .range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(past12MonthsTransactions, (d) => { return d.date; }));
        y.domain([0, d3.max(past12MonthsTransactions, (d) => { return d.total; })]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));   
        svg.append("g")
            .call(d3.axisLeft(y));

            // add the Line
    var totalLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.total); });

    var rentLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.Rent); });

    var electricityLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.Electricity); });

    var groceriesLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.Groceries); });

    var diningOutLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d['Dining Out']); });
    
    svg.append("path")
        .data([past12MonthsTransactions])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", totalLine);

    svg.append("path")
        .data([past12MonthsTransactions])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#7a4ccf")
        .attr("stroke-width", 1.5)
        .attr("d", rentLine);

    svg.append("path")
        .data([past12MonthsTransactions])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#bcc44b")
        .attr("stroke-width", 1.5)
        .attr("d", electricityLine);

    svg.append("path")
        .data([past12MonthsTransactions])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", groceriesLine);

    svg.append("path")
        .data([past12MonthsTransactions])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#4ccf70")
        .attr("stroke-width", 1.5)
        .attr("d", diningOutLine);
    }

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
            <svg id='line-graph'></svg>
        </div>
    )
}