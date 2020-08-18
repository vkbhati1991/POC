import React, { useEffect, useRef } from "react";
import { forceGraph } from "./ForceGraph";
import root from "./JSON/forceTree.json";

function Tree() {

    const treeElem = useRef(null);
    const rootJson = () => forceGraph(root, treeElem.current);

    useEffect(rootJson, []);

    return (
        <div className="forceGraph">
            <svg ref={treeElem} className="forceTree"></svg>
        </div>
    )
}

export { Tree };