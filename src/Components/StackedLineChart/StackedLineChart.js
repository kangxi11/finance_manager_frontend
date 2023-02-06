import React, {useEffect} from 'react';
import * as d3 from 'd3';

export default function StackedLineChart(props) {

    let margin = { top: 20, right: 20, bottom: 50, left: 70 };
    let width = 960 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    let xScale = d3.scaleTime().range([0, width]);
    let yScale = d3.scaleLinear().range([height, 0]);

    let svg;

    useEffect(() => {
        createLineGraph();
    }, [props.past12MonthsTransactions]);

    const createLineGraph = async () => {    
        svg = d3.select("#stacked-line-graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},     ${margin.top})`);

        addAxis();

        let stackedData = d3.stack().keys(props.categories)(props.past12MonthsTransactions);
        
        const colorScale = d3.scaleOrdinal()
            .domain(props.categories)
            .range(d3.schemeSet2);

        let areaGen = d3.area()
            .x(d => xScale(d.data.date.toDate()))
            .y0((d) => yScale(d[0]))
            .y1((d) => yScale(d[1]));
        
        let tooltip = d3.select("#stacked-line-graph-div")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute");

        let mouseover = function() {
            tooltip.style("opacity", 1);
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1);
        }
        let mousemove = function(event,d) {
            tooltip
                .html(d.key)
                .style("left", (event.pageX)+30 + "px")
                .style("top", (event.pageY) + "px");
        }
        let mouseleave = function() {
            tooltip.style("opacity", 0);
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8);
        }

        svg.selectAll("stacked-line-chart-layers")
            .data(stackedData)
            .enter()
            .append("path")
                .attr("class", function(d) { return "stacked-line-chart-areas " + d.key })
                .style("fill", function(d) { return colorScale(d.key); })
                .attr("d", areaGen)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
    }

    const addAxis = () => {
        xScale.domain(d3.extent(props.past12MonthsTransactions, (d) => { return d.date; }));
        yScale.domain([0, d3.max(props.past12MonthsTransactions, (d) => { return d.total; })]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height+40 )
            .text("Time (Month)");
        
        svg.append("g")
            .call(d3.axisLeft(yScale));
    }

    return (
        <div id='stacked-line-graph-div'>
            <svg id='stacked-line-graph'></svg>
        </div>
    );
};