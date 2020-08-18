import React, { useState } from 'react';
import DragElem from "./Drag";
import Grid from "./Grid";
import './style.css';

const initialState = {
    data_id: 0,
    data_gs_x: 1,
    data_gs_y: 1,
    data_gs_width: 3,
    data_gs_height: 4
}

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            layout: []
        };
    }

    createNewComponent = () => {
        const { layout } = this.state;
        console.log("createNewComponent", layout);
        if (layout && layout.length === 0) {

            this.setState({
                layout: [initialState]
            });

        } else {
            const tempLayout = [...layout];
            const lastElem = tempLayout[tempLayout.length - 1];
            const lastElemId = lastElem.data_id;

            const newItem = { ...initialState, data_id: lastElemId + 1 }

            this.setState({
                layout: [...tempLayout, newItem]
            });
        };
    };

    removeComponent = (e, dataId) => {
        const { layout } = this.state;
        e.preventDefault();
        const elemIndex = layout.findIndex(el => el.data_id === dataId);
        const tempLayout = [...layout];
        tempLayout.splice(elemIndex, 1);

        this.setState({
            layout: tempLayout
        });

    };


    setElemProps = (updatedElem) => {
        const { layout } = this.state;

        if (layout && layout.length === 0) return;

        const tempLayout = [...layout];
        const elemIndex = tempLayout.findIndex(el => el.data_id === updatedElem.data_id);
        tempLayout[elemIndex] = updatedElem;

        this.setState({
            layout: tempLayout
        });

    };

    getGridItem = () => {
        const { layout } = this.state;
        if (layout && layout.length === 0) return;

        return layout.map((item, index) => {
            return (
                <DragElem
                    key={index}
                    data_id={item.data_id}
                    data_gs_x={item.data_gs_x}
                    data_gs_y={item.data_gs_y}
                    data_gs_width={item.data_gs_width}
                    data_gs_height={item.data_gs_height}
                    removeComponent={this.removeComponent}
                    setElemProps={this.setElemProps}
                />
            );
        });
    }
    render() {
        return (
            <div className="designerContainer">
                <div className="designerHeader">
                    <div className="addButton" onClick={this.createNewComponent}>+ Add New Component</div>
                </div>

                <div className="grid-stack">
                    <Grid />
                    {this.getGridItem()}
                </div>
            </div>

        );
    }

}

export default React.memo(Dashboard);