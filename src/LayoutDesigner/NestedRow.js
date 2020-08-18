import React, { useState } from "react";

function NestedRow(props) {
    const [flex, setflex] = useState(50);

    function getWidth(flex) {
        return `${flex}%`;
    }

    return (
        <div className="cells"
            onDragOver={props.onDragOver}
            onDrop={props.onDrop}
            style={{width:getWidth(flex), maxWidth:getWidth(flex), minWidth: getWidth(flex)}}
            onDragStart={props.onDragStart} >
            <select className="rowSelect" defaultValue={flex} onChange={(e) => {
                setflex(e.target.value)
            }}>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="30">30%</option>
                <option value="33.33">33%</option>
                <option value="40">40%</option>
                <option value="45">45%</option>
                <option value="50">50%</option>
                <option value="60">60%</option>
                <option value="70">70%</option>
                <option value="75">75%</option>
                <option value="80">80%</option>
                <option value="90">90%</option>
                <option value="95">95%</option>
                <option value="100">100%</option>
            </select>
            {props.children}
        </div>
    )
}

export { NestedRow };