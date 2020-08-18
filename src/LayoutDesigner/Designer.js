import React, { useState, useEffect } from "react";
import { Draggable } from "./Draggable";
import layoutjson from "./layoutjson.json";
import { NestedRow } from "./NestedRow";
import nextId from "react-id-generator";

export const Designer = () => {

  //let data = null;

  const [layout, setLayout] = useState(layoutjson);


  function getRowId(rowsArray, targetId) {
    if (rowsArray && rowsArray.length === 0) {
      return null;
    }

    let returnItem = null;

    rowsArray.forEach(element => {
      if (element.RowId === targetId) {
        returnItem = element.Cells;
      }
      else if (element.Rows) {
        returnItem = getRowId(element.Rows, targetId);
      }
    });

    return returnItem;
  }

  function getCellId(rowsArray, targetId) {
    if (rowsArray && rowsArray.length === 0) {
      return null;
    }

    let returnItem = null;

    rowsArray.forEach(item => {

      if (item && item.Cells && item.Cells.length === 0) {
        return;
      }

      item.Cells.forEach(cell => {
        if (cell.CellId === targetId) {
          returnItem = cell;
        } else if (cell.Rows) {
          returnItem = getCellId(cell.Rows, targetId);
        }
      })

    });

    return returnItem;
  }




  function createcell(cellId, rowid, cellKey) {
    const updatedCellId = cellId + 1;
    return {
      "CellId": updatedCellId,
      "RowId": rowid,
      "CellKey": cellKey
    }
  }

  function getUpdatedCells(targetId) {
    const layoutCopy = { ...layout };
    let targetElem = getRowId(layoutCopy.Rows, targetId);
    let lastIndexofTargetElem = targetElem[targetElem.length - 1];
    let elemCellId = lastIndexofTargetElem.CellId;
    let elemRowId = lastIndexofTargetElem.RowId;
    const newCell = createcell(elemCellId, elemRowId, true);
    targetElem.push(newCell);

    return targetElem;
  }

  function getLayoutJson(targetId, updaredCells) {
    const layoutCopy = { ...layout };
    if (layoutCopy.Rows && layoutCopy.Rows.length === 0) {
      return;
    }
    layoutCopy.Rows.forEach(item => {
      if ((item.RowId === targetId) && !item.CellId) {
        item.Cells = updaredCells;
      }
    });

    return layoutCopy;

  }

  function createEmptyCellRow(rowid, elemCellId, cellKey) {
    const row = createEmptyRow(rowid, cellKey);
    const updatedRowId = rowid + 1;
    const updatedCellId = elemCellId + 1;
    return {
      "Rows": [row],
      "CellId": updatedCellId,
      "RowId": updatedRowId
    }
  }

  function getUpdatedCellsWithRow(targetId) {
    const layoutCopy = { ...layout };
    let targetElem = getCellId(layoutCopy.Rows, targetId);
    let elemRowId = targetElem.RowId;
    let elemCellId = targetElem.CellId;
    const newCell = createEmptyCellRow(elemRowId, elemCellId, true);
    targetElem.CellKey = false;
    targetElem.Rows = newCell.Rows;
    return targetElem;
  }

  function getLayoutJsonNested(targetId, updaredCells) {
    const layoutCopy = { ...layout };
    if (layoutCopy.Rows && layoutCopy.Rows.length === 0) {
      return;
    }
    layoutCopy.Rows.forEach(item => {
      if ((item.RowId === targetId) && !item.CellId) {
        item.Cells[0] = updaredCells;
      }
    });

    return layoutCopy;

  }


  function allowDrop(ev) {
    ev.preventDefault();
  }
  let data = null;
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target);
    data = ev.target.getAttribute("data-attr")
  }

  function drop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let targetId = null;
    if (data === "Cell") {
      targetId = ev.currentTarget.getAttribute("rowid");
      if (targetId) {
        const updaredCells = getUpdatedCells(targetId);
        const updatedLayoutJson = getLayoutJson(targetId, updaredCells);
        setLayout(updatedLayoutJson);
      } else {
        alert("please drag row first, you can not drag cell directly into container");
      }
    }

    if (data === "Row") {
      let target = ev.target.getAttribute("class");
      if (target === "designercontent") {
        getUpdatedRows();
      }
      if (target === "row") {
        alert("please drag Cell first, you can not drag row directly into row");
      }
      if (target === "resizable cells") {
        targetId = ev.target.getAttribute("cellid");
        const updatedRow = getUpdatedCellsWithRow(targetId);
        const updatedLayoutJson = getLayoutJsonNested(targetId, updatedRow);
        setLayout(updatedLayoutJson);
      }

    }

    if (!targetId) {
      return;
    }

  }



  function createEmptyRow(rowid, cellKey) {
    const updatedRowId = rowid + 1;
    const newCell = createcell('0', updatedRowId, cellKey);
    return {
      "Cells": [newCell],
      "RowId": updatedRowId
    }
  }

  function getUpdatedRows() {
    const layoutCopy = { ...layout };
    const rows = layoutCopy.Rows;
    const rowsLastElem = rows[rows.length - 1];
    const rowid = rowsLastElem.RowId;
    const newRow = createEmptyRow(rowid, true);
    rows.push(newRow);
    layoutCopy.Rows = rows;
    setLayout(layoutCopy);
  }




  function getCell(cells) {

    return cells.Cells.map(cell => {
      if (cell.CellKey) {
        return (
          <Draggable cellId={cell.CellId} rowid={cell.RowId} onDragOver={allowDrop} onDrop={drop} onDragStart={drag} >
          </Draggable>

        )
      } 
      
      if (cell.Rows) {
        return (
          <NestedRow onDragOver={allowDrop} onDrop={drop} onDragStart={drag}>
            {getRows(cell.Rows)}
          </NestedRow>
        );
      }

      return null;

    })
  }

  function getRows(Rows) {
    return Rows.map(cells => {
      return (
        <div className="row" rowid={cells.RowId} onDragOver={allowDrop} onDrop={drop} onDragStart={drag} >
          {
            getCell(cells)
          }
        </div>
      )
    })
  }

  function getLayout() {

    const { Rows } = layout;

    if (!Rows) return;

    return getRows(Rows);
  }


  return (
    <div className="designer">
      <div className="designer-header">
        header
      </div>
      <div className="designerBody">
        <div className="designerNav">

          <div id="hello" onDragOver={allowDrop} onDrop={drop} onDragStart={drag} draggable="true" data-attr={'Container'} className="cell">Card</div>
          <div id="hellos" onDragOver={allowDrop} onDrop={drop} onDragStart={drag} draggable="true" data-attr={'Row'} className="cell">Row</div>
          <div id="helloss" onDragOver={allowDrop} onDrop={drop} onDragStart={drag} draggable="true" data-attr={'Cell'} className="cell">Cell</div>
        </div>
        <div className="designercontent" onDragOver={allowDrop} onDrop={drop}>
          {
            getLayout()
          }
        </div>
      </div>

    </div>

  );
}