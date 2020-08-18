import React from 'react';
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
        if (layout && layout.length === 0) {

            this.setState({
                layout: [initialState]
            });

        } else {
            const tempLayout = [...layout];
            const lastElem = tempLayout[tempLayout.length - 1];
            const lastElemId = lastElem.data_id;

            const elemX = tempLayout.filter(el => el.data_gs_x === 1);
            let yPos = 1;

            elemX.forEach(item => {
                yPos = yPos + item.data_gs_height;
            });

            console.log(yPos)

            const newItem = { ...initialState, data_gs_y: yPos, data_id: lastElemId + 1 }

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
        const elem = tempLayout[elemIndex];

        if(!elem) return;
        
        const newUpdatedItem = {
            data_id: updatedElem.data_id,
            data_gs_width: updatedElem.data_gs_width || elem.data_gs_width,
            data_gs_height: updatedElem.data_gs_height || elem.data_gs_height,
            data_gs_x: updatedElem.data_gs_x || elem.data_gs_x,
            data_gs_y: updatedElem.data_gs_y || elem.data_gs_y
        }

        tempLayout[elemIndex] = newUpdatedItem;

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