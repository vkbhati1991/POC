import React from "react";
import layoutjson from "./layout.json";

class Layout extends React.Component {

    getHeightInPx = (height) => {
        switch (height) {
            case '10%':
                return '60';
            case '20%':
                return '120';
            case '30%':
                return '180';
            case '40%':
                return '240';
            case '50%':
                return '300';
            case '60%':
                return '360';
            case '70%':
                return '420';
            case '80%':
                return '480';
            case '90%':
                return '540';
            default:
                return '600';
        }
    }

    getHeight = (height) => {

        return `${this.getHeightInPx(height)}px`;

    }

    getCard = (cell, RowHeight) => {
        const heighst = `${this.getHeightInPx(cell.CellHeight)}px`;
        const cardHeight = `${this.getHeightInPx(cell.CellHeight) - 16}px`;
        return (
            <div className="cardwrapper" title={RowHeight} style={{ height:heighst}}>
            <div className="card" style={{ height: cardHeight }}>
                {`"Height" = ${cell.CellHeight}`}
                <br/>
                {`"Width" = ${cell.Cellwidth}`}
                <br/>
                {`"Parent" = ${RowHeight}`}
            </div>
            </div>
        );
    }

    getCell = (cells) => {
        return cells.Cells.map(cell => {
            if (cell.ControlKey) {
                return (
                    <div className="cells" style={{ width: cell.Cellwidth }}>
                        {this.getCard(cell)}
                    </div>

                )
            } else if (cell.Rows) {
                return (
                    <div className="cells" style={{ width: cell.Cellwidth }}>
                        {this.getRows(cell.Rows)}
                    </div>
                )
            }

            return null;

        })
    }
    getRows = (Rows) => {
        return Rows.map(cells => {
            return (
                <div className="row">
                    {
                        this.getCell(cells)
                    }
                </div>
            )
        })
    }

    getLayout = () => {

        const { Rows } = layoutjson;

        return this.getRows(Rows);
    }

    render() {
        return (
            <div className="layout">
                {this.getLayout()}
            </div>
        )
    }
}

export default Layout;