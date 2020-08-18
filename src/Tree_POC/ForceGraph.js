/*eslint-disable */
import * as d3 from "d3";
import { getValue } from "./GetValue";
import { getLabel } from "./GetLabel";
import { func } from "prop-types";

function forceGraph(graph, id, mergeData) {

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


    const width = 1000;
    const height = 500;
    const adjlist = [];

    const label = {
        "nodes": [],
        "links": []
    };

    graph.nodes.forEach(function (d, i) {
        label.nodes.push({ node: d });
        label.nodes.push({ node: d });
        label.links.push({
            source: i * 2,
            target: i * 2 + 1
        });
    });

    const labelLayout = d3.forceSimulation(label.nodes)
        .force("charge", d3.forceManyBody().strength(-10))
        .force("link", d3.forceLink(label.links).distance(0).strength(2));

    const graphLayout = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-8000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function (d) { return d.UniqueKey; }).distance(40).strength(1))
        .on("tick", ticked);

    graph.links.forEach(function (d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

    function neigh(a, b) {
        return a === b || adjlist[a + "-" + b];
    }


    const svg = d3.select(id).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();
    const container = svg.append("g");

    svg && svg.call(
        d3.zoom()
            .scaleExtent([.1, 4])
            .on("zoom", function () { container.attr("transform", d3.event.transform); })
    );

    const path = container.append("g").attr("class", "paths")
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrowhead)")
        .attr("stroke", function (d) { return "#999" })
        .attr("d", function (d) {
            return "M" + d.source.x + "," + d.source.y + " L " +
                d.target.x + "," + d.target.y;
        });

    function getNodeSize(d) {
        if (d.index === 0) {
            return 70;
        }
        return 60;
    }

    function getBorderNodeSize(d) {
        if (d.index === 0) {
            return 62;
        }
        return 52;
    }

    function getColor(d) {

        return colorArray[d.index || 0];
    }


    const node = container.append("g").attr("class", "nodes")
        .selectAll("rect")
        .data(graph.nodes)
        .enter()
        .append("rect")
        .attr("height", function (d) { return getNodeSize(d) })
        .attr("width", function (d) { return getNodeSize(d) })
        .attr("x", function (d) { return (-getNodeSize(d) / 2) })
        .attr("y", function (d) { return (-getNodeSize(d) / 2) })
        .attr("rx", function (d) { return getNodeSize(d) })
        .attr("ry", function (d) { return getNodeSize(d) })
        .attr("fill", function (d) { return getColor(d) });

    const borderNode = container.append("g").attr("class", "border")
        .selectAll("rect")
        .data(graph.nodes)
        .enter()
        .append("rect")
        .attr("height", function (d) { return getBorderNodeSize(d) })
        .attr("width", function (d) { return getBorderNodeSize(d) })
        .attr("x", function (d) { return (-getBorderNodeSize(d) / 2) })
        .attr("y", function (d) { return (-getBorderNodeSize(d) / 2) })
        .attr("rx", function (d) { return getBorderNodeSize(d) })
        .attr("ry", function (d) { return getBorderNodeSize(d) })
        .attr("stroke", function (d) { return "#fff" })
        .attr("stroke-width", "3")
        .attr("fill", function (d) { return "transparent" });


    const image = container.append("g").attr("class", "image")
        .selectAll("image")
        .data(graph.nodes)
        .enter()
        .append("image")
        .attr("xlink:href", function (d) { return d.ImageSource.ActiveImage })
        .attr("x", function (d) { return d.x - 15 })
        .attr("y", function (d) { return d.y - 15 })
        .attr("height", 30)
        .attr("width", 30)
        .attr("radius", "36px");

    image.on("mouseover", focus).on("mouseout", unfocus).on("click", mergeDataFunction);
    node.on("mouseover", focus).on("mouseout", unfocus).on("click", mergeDataFunction);
    borderNode.on("mouseover", focus).on("mouseout", unfocus).on("click", mergeDataFunction);

    node.call(
        d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

   

    function ticked() {

        node.call(updateNode);
        path.call(updatePath);
        image.call(updateImage);
        borderNode.call(updateBorder)

        labelLayout.alphaTarget(0.3).restart();

    }

    function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
    }

    function focus(d) {
        var index = d3.select(d3.event.target).datum().index;
        node.style("opacity", function (o) {
            return neigh(index, o.index) ? 1 : 0.1;
        });
       
        path.style("opacity", function (o) {
            return o.source.index === index || o.target.index === index ? 1 : 0.1;
        });
       

    }

    function mergeDataFunction(d) {
        mergeData(d);
    }

    function unfocus() {
        node.style("opacity", 1);
        path.style("opacity", 1);
    }

    function updatePath() {
        path.attr("d", function (d) {
            return "M" + d.source.x + "," + d.source.y + " L " +
                d.target.x + "," + d.target.y;
        });


    }

    function updateNode(node) {
        node.attr("transform", function (d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    function updateBorder(node) {
        node.attr("transform", function (d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    function updateImage(node) {

        image.attr("x", function (d) { return d.x - 15 })
            .attr("y", function (d) { return d.y - 15 })
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) graphLayout.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

export { forceGraph };