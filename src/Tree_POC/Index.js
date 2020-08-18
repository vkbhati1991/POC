import React from "react";
//import PropTypes from "prop-types";
import { forceGraph } from "./ForceGraph";
// import HttpHelper from "../../../../../Utils/Http";
// import { GridRequest } from "../../../../../Classes/GridRequest";
// import Loader from "../../../../Loader";
import data from "./JSON/forceTree.json";
//import root1 from "./JSON/forceTree copy.json";

const cellObject = {
    field0: null,
    field1: null,
    field2: null,
    field3: null,
    field4: null,
    color: null,
    type: "round",
}

const colorArray = [
    '#007bff',
    '#6610f2',
    '#6f42c1',
    '#e83e8c',
    "#ffb700",
    "#dc3545",
    "#fd7e14",
    "#ffc107",
    "#28a745",
    "#137752",
    "#20c997"
];

class Tree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rootData: null
            //isLoading: true
        };
    }

    createLinks = (element, linkTempArray) => {

        if (!element && (element && element.length === 0)) return;

        element.Links.forEach(el => {
            linkTempArray.push(el);
        });
    }

    createNodes = (element, nodeTempArray) => {

        if (!element && (element && element.length === 0)) return;

        const cellsArray = element.Rows[0].Cells;

        if (cellsArray && cellsArray.length > 0) {
            cellObject.field0 = cellsArray[0];
            cellObject.field1 = cellsArray[1];
            cellObject.field2 = cellsArray[2];
            cellObject.field3 = cellsArray[3];
            cellObject.field4 = cellsArray[4];
            cellObject.color = "red"
        }

        let tempRow = {};

        element.Rows.forEach(row => {

            tempRow = { ...row, ...cellObject };

            nodeTempArray.push(tempRow);
        });
    }

    prepeareGraphJson = (data) => {

        const createdJson = {
            nodes: [],
            links: []
        }

        if (!data || (data && data.length === 0)) return;

        const linkTempArray = [];
        const nodeTempArray = [];

        data.forEach(element => {
            this.createLinks(element, linkTempArray);
            this.createNodes(element, nodeTempArray);
        });

        createdJson.links = [...linkTempArray]
        createdJson.nodes = [...nodeTempArray]

        return createdJson;
    }

    createForceGraphData = (data) => {
        const createdJson = this.prepeareGraphJson(data);
        this.setState({
            rootData: createdJson
        }, () => {
            forceGraph(this.state.rootData, this.graph, this.createForceGraphData);
        });
    }

    componentDidMount() {
        this.createForceGraphData(data);
    }

    render() {

        return (
            <div className="forceGraph">
                <svg ref={(node) => { this.graph = node; }} className="forceTree"></svg>
            </div>
        );
    }
}


export default Tree;