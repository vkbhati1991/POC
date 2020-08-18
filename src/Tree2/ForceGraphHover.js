import * as d3 from "d3";

function createTree(data, id, width = 800, height = 600) {

    let w = width,
        h = height,
        i = 0,
        duration = 300;

    const nodeHeight = 70;
    const nodeWidth = 180;
    const halfNodeHeight = nodeHeight / 2;
    const halfNodeWidth = nodeWidth / 2;
    const rectStrokeColor = "green";
    const rectFillColor = "#fff";
    const rectStrokeWidth = 1;
    const linkStrokeColor = "green";
    const linkStrokeWidth = 1;

    const svg = d3.select(id).append("svg").attr("width", w).attr("height", h);
    const gContainer = svg.append("g").attr("transform", "translate(" + 20 + ", " + (halfNodeHeight + 20) + ")");

    const dataStructure = d3.stratify().id(function (d) { return d.childId }).parentId(function (d) { return d.parentId })(data);
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
            .attr("stroke-width", linkStrokeWidth)
            .attr("d", function (d) {
                return `M${d.source.x - halfNodeWidth}, ${d.source.y}h 0 v 50 H${d.target.x - halfNodeWidth}, V${d.target.y - halfNodeWidth}`;
            });

        // Transition links to their new position.
        rootLinks.transition()
            .duration(duration)
            .attr("d", function (d) {
                return `M${d.source.x - halfNodeWidth}, ${d.source.y}h 0 v 50 H${d.target.x - halfNodeWidth}, V${d.target.y - halfNodeWidth}`;
            });


        // Transition exiting nodes to the parent's new position.
        rootLinks.exit()
            .attr("d", function (d) {
                return `M${d.source.x - halfNodeWidth}, ${d.source.y}h 0 v 50 H${d.target.x - halfNodeWidth}, V${d.target.y - halfNodeWidth}`;
            })
            .remove();

        //Create Root Nodes

        const rootNodes = rootContainer.selectAll("g").data(information.descendants(), function (d) { return d.id || (d.id = ++i); });

        const nodeEnter = rootNodes.enter().append("g")
            .attr("class", "rootnode")
            .attr("fill", "#00a99d")
            .attr("transform", function (d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
            .on("click", function (d) { toggle(d); updateTree(d); })
            .on("mouseenter", function (d) { focusfun(d); })
            .on("mouseleave", function (d) { unfocus(d); });

        const nodeRect = nodeEnter.append("rect")
            .attr("height", nodeHeight)
            .attr("width", nodeWidth)
            .attr("fill", rectFillColor)
            .attr("stroke", rectStrokeColor)
            .attr("stroke-width", rectStrokeWidth)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", -nodeWidth)
            .attr("y", -halfNodeHeight);



        const defs = nodeEnter.append("defs");

        defs.append("clipPath")
            .attr("id", "avatar-clip")
            .append("circle")
            .attr("cx", "-26px")
            .attr("cy", "-10px")
            .attr("r", 18)

        nodeEnter.append("svg:image")
            .attr("xlink:href", function (d) { return d.data.image })
            .attr("x", "-45px")
            .attr("y", "-28px")
            .attr("width", "36px")
            .attr("radius", "36px")
            .attr("clip-path", "url(#avatar-clip)")
            .attr("height", "36px");

        nodeEnter.append("text")
            .text(function (d) { return d.data.name.length > 6 ? `${d.data.name.substring(0, 6)}..` : d.data.name; })
            .attr("x", -44)
            .attr("y", 24)
            .attr("fill", "#000")
            .attr("font-size", "11px")
            .attr("font-family", "arial")
            .classed("title", true);



        const rootNodesTooltip = tooltipContainer.selectAll("g").data(information.descendants(), function (d) { return d.id || (d.id = ++i); });
        const tooltip = rootNodesTooltip.enter().append("g")
            .attr("class", "tooltipNode")
            .attr("fill", "#00a99d")
            .attr("transform", function (d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
            .attr("display", "none");

        tooltip.append("rect")
            .attr("height", 60)
            .attr("width", 140)
            .attr("x", 0)
            .attr("y", 0)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("fill", "red")
            .attr("stroke", function (d) { return "green" })
            .attr("stroke-width", "1");

        tooltip.append("text")
            .text(function (d) { return "om" })
            .attr("font-family", "arial")
            .attr("fill", function (d) { return "black" })
            .attr("x", 8)
            .attr("y", 16)
            .attr("font-size", "12px");

        // Transition nodes to their new position.


        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
                return "translate(" + d.x + "," + d.y + ")";
            });


        tooltip.transition()
            .attr("transform", function (d) {
                let x = d.x - 100;
                let y = d.y - 100;
                if (d.id === "1") {
                    y = d.y + 40;
                }

                d.x0 = d.x;
                d.y0 = d.y;
                return "translate(" + x + "," + y + ")";
            });


        // Transition exiting nodes to the parent's new position.
        rootNodes.exit().transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
            .remove();

        rootNodesTooltip.exit().transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
            .remove();

        function focusfun(d) {
            nodeRect
                .transition()
                .duration(duration)
                .attr("height", function (o) {
                    return d.id === o.id ? 170 : 70;
                });

            tooltip.attr("display", function (o) {
                return d.id === o.id ? "block" : "none";
            });

        }

        function unfocus() {
            nodeRect.attr("height", 70);

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

    //svg.call(zoom);


}

export { createTree };