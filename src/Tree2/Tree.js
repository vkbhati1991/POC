

import * as d3 from "d3";
import { getValue, getLinkUrl } from "./TreeFormaters/GetValue";
import { getLabel } from "./TreeFormaters/GetLabel";
import { getRectBgColor } from "./TreeFormaters/GetBgColor";
import { treeFormater } from "./TreeFormaters/TreeFormater";

/*eslint-disable*/
function createOrgTree(rootData, id) {

    if (!rootData) return;

    const data = rootData.Rows;

    const dataStructure = d3.stratify().id(function (d) { return d.UniqueKey }).parentId(function (d) { return d.ParentKey })(data);

    console.log(data[0]);

    let depthHeight = dataStructure && dataStructure.height || 0;
    let depthWidth = 0;
    const nodeHeight = 70;
    const nodeWidth = 180;
    const halfNodeHeight = nodeHeight / 2;
    const halfNodeWidth = nodeWidth / 2;
    const rectStrokeWidth = 1;
    const linkStrokeColor = "#333333";
    const tooltipHeight = 100;
    const tooltipWidth = 260;
    let childcount = 0;
    let elDepth = 0;

    const columns = data[0].Cells;

    const col0 = columns[0];
    const col1 = columns[1];
    const col2 = columns[2];
    const col3 = columns[3];
    const col4 = columns[4];

    function getDepth(item, elDepth) {

        if (!item || item.length === 0) return;
        item.forEach(el => {
            if (el.children) {

                elDepth = el.depth;

                if (elDepth === el.depth) {
                    childcount = childcount + el.children.length;
                } else {

                    depthWidth = childcount > depthWidth ? childcount : depthWidth;
                }
                depthWidth = childcount;

                getDepth(el.children);
            }
        });
    }
    if (dataStructure) {
        getDepth(dataStructure.children, elDepth);
    }

    const tempWidth = (window.innerWidth < 600 ? window.innerWidth : ((depthWidth * nodeWidth) + 200));
    const tempHeight = ((depthHeight) * 180);
    let w = tempWidth < 900 ? 900 : tempWidth,
        h = tempHeight < 400 ? 400 : tempHeight,
        i = 0,
        duration = 300;

    // /const svg = d3.select(id).append("svg").attr("width", w).attr("height", h).attr("viewBox", `0 0 ${h} ${w}`);
    //const gContainer = svg.append("g").attr("transform", "translate(" + (nodeWidth / 2) + ", " + (50) + ")");
    const svg = d3.select(id)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("viewBox", `0 0 ${w} ${h}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
    const gContainer = svg.append("g").attr("transform", "translate(" + (20) + ", " + (60) + ")");


    dataStructure.x0 = h / 2;
    dataStructure.y0 = 0;


    const treeStructure = d3.tree().separation(function (a, b) {
        return a.parent === b.parent ? 1 : 1
    }).size([w, h - 100]);

    const information = treeStructure(dataStructure);
    const linkContainer = gContainer.append("g").attr("id", "linkContainer");
    const rootContainer = gContainer.append("g").attr("id", "rootContainer");
    const tooltipContainer = gContainer.append("g").attr("id", "tooltipContainer");


    updateTree(dataStructure);

    window.addEventListener("resize", updateTree(dataStructure));

    function updateTree(source) {

        const rootLinks = linkContainer.selectAll("path").data(information.links(), function (d) { return d.id || (d.id = ++i); });

        rootLinks.enter()
            .append("path")
            .attr("fill", "none")
            .transition()
            .duration(300)
            .attr("stroke", linkStrokeColor)
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            .attr("d", function (d) {
                //return `M${d.source.x - halfNodeWidth},${d.source.y}V${d.target.y}H${d.target.x}`;
                return "M" + (d.source.x) + "," + (d.source.y) + " v 50 H" + d.target.x + " V" + (d.target.y);
            });

        // Transition links to their new position.
        rootLinks.transition()
            .duration(duration)
            .attr("d", function (d) {
                //return `M${d.source.x - halfNodeWidth},${d.source.y}V${d.target.y}H${d.target.x}`;
                return "M" + (d.source.x) + "," + d.source.y + " v 50 H" + d.target.x + " V" + d.target.y;
            });

        // Transition exiting nodes to the parent's new position.
        rootLinks.exit()
            .attr("d", function (d) {
                //return `M${d.source.x - halfNodeWidth},${d.source.y}V${d.target.y}H${d.target.x}`;
                return "M" + (d.source.x - halfNodeWidth) + "," + d.source.y + " v 50 H" + d.target.x + " V" + d.target.y;
            })
            .remove();

        function getHref(column) {
            switch (column.Type) {
                case treeFormater.URL:
                    return "xlink:href";
                default:
                    return "";
            }
        }

        //Create Root Nodes

        const rootNodes = rootContainer.selectAll("g").data(information.descendants(), function (d) { return d.id || (d.id = ++i); });

        const nodeEnter = rootNodes.enter().append("g")
            .attr("class", "rootnode")
            .attr("fill", "#00a99d")
            .attr("transform", function (d) { return "translate(" + (source.x0 + halfNodeWidth) + "," + source.y0 + ")"; })
            .on("click", function (d) { toggle(d); updateTree(d); })
            .on("mouseenter", function (d) { focusfun(d); })
            .on("mouseleave", function (d) { unfocus(d); });


        nodeEnter.append("rect")
            .attr("height", nodeHeight)
            .attr("width", nodeWidth)
            .attr("fill", function (d) { return getRectBgColor(d, depthHeight); })
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", -nodeWidth)
            .attr("y", -halfNodeHeight);

        nodeEnter.append("rect")
            .attr("height", (nodeHeight - 8))
            .attr("width", (nodeWidth - 8))
            .attr("fill", "transparent")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("stroke", "#fff")
            .attr("stroke-width", rectStrokeWidth)
            .attr("stroke-dasharray", "3,2")
            .attr("x", (-nodeWidth + 4))
            .attr("y", (-halfNodeHeight + 4));

        nodeEnter.append("circle")
            .attr("fill", function (d) { return getRectBgColor(d, depthHeight) })
            .attr("cx", -halfNodeWidth)
            .attr("cy", -(halfNodeHeight + 4))
            .attr("r", function (d) { return d.depth === 0 ? 0 : 3 });

        nodeEnter.append("circle")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("fill", "#fff")
            .attr("cx", (-nodeWidth + 34))
            .attr("cy", 0)
            .attr("r", 20);

        const defs = nodeEnter.append("defs");

        defs.append("clipPath")
            .attr("id", "avatar-clip")
            .append("circle")
            .attr("cx", (-nodeWidth + 34))
            .attr("cy", 0)
            .attr("r", 19)

        nodeEnter.append("svg:image")
            .attr("xlink:href", function (d) { return d.data.ImageSource.ActiveImage })
            .attr("x", (-nodeWidth + 10))
            .attr("y", "-20px")
            .attr("width", "50px")
            .attr("height", "50px")
            .attr("clip-path", "url(#avatar-clip)");


        const title = nodeEnter.append("a")
            .attr("xlink:href", function (d) { return d.data.Url })
            .attr("target", "_blank");

        title.append("text")
            .text(function (d) { return d.data.Title.length > 12 ? `${d.data.Title.substring(0, 12)}...` : d.data.Title; })
            .attr("x", (-halfNodeWidth - 28))
            .attr("y", -5)
            .attr("fill", "#fff")
            .attr("font-size", "14px")
            .attr("cursor", "pointer")
            .attr("font-family", "arial")
            .classed("title", true);

        const subtitle = nodeEnter.append("a")
            .attr(getHref(col0), function (d) { return getLinkUrl(d, col0) })
            .attr("target", "_blank");

        subtitle.append("text")
            .text(function (d) { return getValue(d, col0) })
            .attr("x", (-halfNodeWidth - 28))
            .attr("y", 16)
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-family", "arial");

        const rootNodesTooltip = tooltipContainer.selectAll("g").data(information.descendants(), function (d) { return d.id || (d.id = ++i); });
        const tooltip = rootNodesTooltip.enter().append("g")
            .attr("class", "tooltipNode")
            .attr("fill", "#00a99d")
            .attr("transform", function (d) { return "translate(" + (source.x0) + "," + source.y0 + ")"; })
            .attr("display", "none");

        tooltip.append("rect")
            .attr("height", tooltipHeight)
            .attr("width", tooltipWidth)
            .attr("x", 0)
            .attr("y", 0)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("fill", function (d) { return getRectBgColor(d, depthHeight); });

        tooltip.append("rect")
            .attr("height", (tooltipHeight - 10))
            .attr("width", (tooltipWidth - 10))
            .attr("fill", "transparent")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("stroke", "#fff")
            .attr("stroke-width", rectStrokeWidth)
            .attr("stroke-dasharray", "3,2")
            .attr("x", 5)
            .attr("y", 5);

        tooltip.append("text")
            .text(function () { return getLabel(col1) })
            .attr("x", 16)
            .attr("y", 24)
            .attr("fill", "#fff")
            .attr("font-size", "11px")
            .attr("font-family", "arial");

        tooltip.append("text")
            .text(function (d) { return getValue(d, col1) })
            .attr("x", 16)
            .attr("y", 42)
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-family", "arial");

        tooltip.append("text")
            .text(function () { return getLabel(col2) })
            .attr("x", 16)
            .attr("y", 66)
            .attr("fill", "#fff")
            .attr("font-size", "11px")
            .attr("font-family", "arial");

        tooltip.append("text")
            .text(function (d) { return getValue(d, col2) })
            .attr("x", 16)
            .attr("y", 85)
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-family", "arial");

        tooltip.append("text")
            .text(function () { return getLabel(col3) })
            .attr("x", (tooltipWidth / 2))
            .attr("y", 24)
            .attr("fill", "#fff")
            .attr("font-size", "11px")
            .attr("font-family", "arial");

        tooltip.append("text")
            .text(function (d) { return getValue(d, col3) })
            .attr("x", (tooltipWidth / 2))
            .attr("y", 42)
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-family", "arial");

        tooltip.append("text")
            .text(function () { return getLabel(col4) })
            .attr("x", (tooltipWidth / 2))
            .attr("y", 66)
            .attr("fill", "#fff")
            .attr("font-size", "11px")
            .attr("font-family", "arial");

        tooltip.append("text")
            .text(function (d) { return getValue(d, col4) })
            .attr("x", (tooltipWidth / 2))
            .attr("y", 85)
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-family", "arial");



        const getTooltipTop = function (d) {
            if (d.depth === 0) {
                return -36;
            }

            return (tooltipHeight + 38);
        }

        // Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
                return "translate(" + (d.x + halfNodeWidth) + "," + d.y + ")";
            });

        tooltip.transition()
            .attr("transform", function (d) {
                let x = d.x - (tooltipWidth / 2);
                let y = d.y - getTooltipTop(d);

                return "translate(" + x + "," + y + ")";
            });


        // Transition exiting nodes to the parent's new position.
        rootNodes.exit().transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + (source.x + halfNodeWidth) + "," + source.y + ")"; })
            .remove();

        rootNodesTooltip.exit().transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
            .remove();

        function focusfun(d) {

            tooltip.attr("display", function (o) {
                return d.id === o.id ? "block" : "none";
            });
        }

        function unfocus() {
            tooltip.attr("display", "none");
        }

        // Toggle children.
        function toggle(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }

        }
    }


    const zoom = d3.zoom()
        .extent([[0, 0], [w, h]])
        .scaleExtent([.25, 8])
        .on("zoom", zoomed)
    function zoomed() {
        gContainer.attr("transform", d3.event.transform);
    }

    svg.call(zoom);
}

export { createOrgTree };