import React from 'react';

function gridCol() {

    const gridArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return gridArray.map((item, i) => {
        return (
            <div key={i} className="grid-col" >
                <div className="grid-item"></div>
            </div >
        );
    })
}


function createRow() {
    const rowArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return rowArray.map((item, i) => {
        return (
            <div key={i} className="grid-row">
                {gridCol()}
            </div>
        );
    })
}


const Grid = () => {
    return (
        <div id="grd-drag" className="grid-container">
            {createRow()}
        </div>
    );
}

export default Grid;