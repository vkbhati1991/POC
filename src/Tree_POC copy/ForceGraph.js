/*eslint-disable */
import * as d3 from "d3";
import { getValue } from "./GetValue";
import { getLabel } from "./GetLabel";
import { func } from "prop-types";

function forceGraph(graph, id, mergeData) {

    const { nodes, links } = graph;
    if ((nodes && nodes.length === 0) || (links && links.length === 0)) {
        return;
    }

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
        .attr("stroke-width", 1)
        .attr("marker-end", "url(#arrowhead)")
        .attr("stroke", function (d) { return d.colorLink })
        .attr("d", function (d) {
            return "M" + d.source.x + "," + d.source.y + " C " +
                d.source.x + "," + (d.source.y + d.target.y) / 2 + " " +
                d.target.x + "," + (d.source.y + d.target.y) / 2 + " " +
                d.target.x + "," + d.target.y;
        });



    const node = container.append("g").attr("class", "nodes")
        .selectAll("rect")
        .data(graph.nodes)
        .enter()
        .append("rect")
        .attr("height", function (d) { return d.type === "round" ? 44 : 40 })
        .attr("width", function (d) { return d.type === "round" ? 44 : 40 })
        .attr("x", function (d) { return d.type === "round" ? -22 : -20 })
        .attr("y", function (d) { return d.type === "round" ? -22 : -20 })
        .attr("rx", function (d) { return d.type === "round" ? 44 : 4 })
        .attr("ry", function (d) { return d.type === "round" ? 44 : 4 })
        .attr("fill", function (d) { return d.color; });

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




    node.call(
        d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

    const labelNode = container.append("g").attr("class", "labelNodes")
        .selectAll("text")
        .data(label.nodes)
        .enter()
        .append("text")
        .attr("x", function (d) { return d.node.Title.length > 16 ? -50 : -20 })
        .attr("y", 40)
        .text(function (d, i) { return i % 2 === 0 ? "" : d.node.Title; })
        .style("fill", "#000")
        .style("font-family", "Arial")
        .style("font-size", 11)
        .style("font-wight", "bold")
        .style("pointer-events", "none"); // to prevent mouseover/drag capture

    node.on("mouseover", focus).on("mouseout", unfocus);

    //Create Tooltip

    const tooltip = container.append("g").attr("class", "tooltip")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("display", "none");

    tooltip.append("rect")
        .attr("height", 136)
        .attr("width", 240)
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "white")
        .attr("stroke", function (d) { return d.color })
        .attr("stroke-width", "1");

    tooltip.append("text")
        .text(function (d) { return getLabel(d.field0) })
        .attr("font-family", "arial")
        .attr("fill", "#555")
        .attr("x", 12)
        .attr("y", 20)
        .attr("font-size", "11px");

    tooltip.append("text")
        .text(function (d) { return getValue(d, d.field0) })
        .attr("font-family", "arial")
        .attr("fill", "#000")
        .attr("x", 12)
        .attr("y", 38)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")


    tooltip.append("text")
        .text(function (d) { return getLabel(d.field1) })
        .attr("font-family", "arial")
        .attr("fill", "#555")
        .attr("x", 120)
        .attr("y", 20)
        .attr("font-size", "11px");

    tooltip.append("text")
        .text(function (d) { return getValue(d, d.field1) })
        .attr("font-family", "arial")
        .attr("fill", "#000")
        .attr("x", 120)
        .attr("y", 38)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")

    tooltip.append("text")
        .text(function (d) { return getLabel(d.field2) })
        .attr("font-family", "arial")
        .attr("fill", "#555")
        .attr("x", 12)
        .attr("y", 60)
        .attr("font-size", "11px");

    tooltip.append("text")
        .text(function (d) { return getValue(d, d.field2) })
        .attr("font-family", "arial")
        .attr("fill", "#000")
        .attr("x", 12)
        .attr("y", 78)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")

    tooltip.append("text")
        .text(function (d) { return getLabel(d.field3) })
        .attr("font-family", "arial")
        .attr("fill", "#555")
        .attr("x", 120)
        .attr("y", 60)
        .attr("font-size", "11px");

    tooltip.append("text")
        .text(function (d) { return getValue(d, d.field3) })
        .attr("font-family", "arial")
        .attr("fill", "#000")
        .attr("x", 120)
        .attr("y", 78)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")


    tooltip.append("text")
        .text(function (d) { return getLabel(d.field4) })
        .attr("font-family", "arial")
        .attr("fill", "#555")
        .attr("x", 12)
        .attr("y", 100)
        .attr("font-size", "11px");

    tooltip.append("text")
        .text(function (d) { return getValue(d, d.field4) })
        .attr("font-family", "arial")
        .attr("fill", "#000")
        .attr("x", 12)
        .attr("y", 118)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")


    function ticked() {

        node.call(updateNode);
        path.call(updatePath);
        image.call(updateImage);
        tooltip.call(updateTooltip)

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function (d, i) {
            if (i % 2 === 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                const b = this.getBBox();

                const diffX = d.x - d.node.x;
                const diffY = d.y - d.node.y;

                const dist = Math.sqrt(diffX * diffX + diffY * diffY);

                let shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                const shiftY = 16;

                this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });
        labelNode.call(updateNode);

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
        labelNode.attr("display", function (o) {
            return neigh(index, o.node.index) ? "block" : "none";
        });
        path.style("opacity", function (o) {
            return o.source.index === index || o.target.index === index ? 1 : 0.1;
        });
        tooltip.attr("display", function (o) {
            return d.UniqueKey === o.UniqueKey ? "block" : "none";
        });

    }

    function mergeDataFunction(d){
        mergeData(d);
    }

    function unfocus() {
        labelNode.attr("display", "block");
        node.style("opacity", 1);
        path.style("opacity", 1);
        tooltip.attr("display", "none");
    }

    function updatePath(pathLine) {
        path.attr("d", function (d) {
            return "M" + d.source.x + "," + d.source.y + " C " +
                d.source.x + "," + (d.source.y + d.target.y) / 2 + " " +
                d.target.x + "," + (d.source.y + d.target.y) / 2 + " " +
                d.target.x + "," + d.target.y;
        });
    }

    function updateNode(node) {
        node.attr("transform", function (d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    function updateTooltip(node) {
        tooltip.attr("transform", function (d) {
            return "translate(" + fixna(d.x + 30) + "," + fixna(d.y - 30) + ")";
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