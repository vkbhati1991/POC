import React from "react";
import { createOrgTree } from "./Tree";
import root from "./JSON/forceTree.json";

class Tree extends React.Component {
    
    componentDidMount() {
        if (!this.treeElem) return;

        createOrgTree(root, this.treeElem);
    }

    render() {
        return (
            <div className="forceGraph" ref={(n) => { this.treeElem = n }}>
            </div>
        );
    }
}

export default Tree;