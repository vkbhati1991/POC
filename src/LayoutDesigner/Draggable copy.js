import React, { useRef, useEffect } from "react";


export const Draggable = ({ children }) => {

  const elemRef = useRef(null);

  let state = { distX: 0, distY: 0 };
  let selectedElement = false;

  useEffect(() => {
    const elem = elemRef.current;
    elem.addEventListener('mousedown', startDrag);
    elem.addEventListener('mousemove', drag);
    elem.addEventListener('mouseup', endDrag);
    elem.addEventListener('mouseleave', endDrag);


    return () => {

      elem.removeEventListener('mousedown', startDrag);
      elem.removeEventListener('mousemove', drag);
      elem.removeEventListener('mouseup', endDrag);
      elem.removeEventListener('mouseleave', endDrag);
    }
  });


  function startDrag(evt) {
    if (evt.target.classList.contains("draggable")) {
      state.distX = Math.abs(elemRef.current.offsetLeft - evt.clientX);
      state.distY = Math.abs(elemRef.current.offsetTop - evt.clientY);
      selectedElement = evt.target;
      elemRef.current.style.position = "absolute";
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      elemRef.current.style.left = `${evt.clientX - state.distX}px`;
      elemRef.current.style.top = `${evt.clientY - state.distY}px`;
    }
  }

  function endDrag(evt) {
    selectedElement = null;
    elemRef.current.style.position = "absolute";
  }

  function startResizeing(evt) {
    if (evt.target.classList.contains("resize")) {
      state.distX = Math.abs(elemRef.current.offsetWidth - evt.clientX);
      state.distY = Math.abs(elemRef.current.offsetHeight - evt.clientY);
      selectedElement = evt.target;
    }
  }
  function resizeing(evt) {
    if (selectedElement) {
      evt.preventDefault();
      elemRef.current.style.width = `${evt.clientX - state.distX}px`;
      elemRef.current.style.height = `${evt.clientY - state.distY}px`;
    }
  }
  function endResizeing(e) {
    endDrag(e);
  }

  return (
    <div className='resizable' ref={elemRef}>
      <div className='resizers'>
        {children}
        <div className='resizer top-left'></div>
        <div className='resizer top-right'></div>
        <div className='resizer bottom-left'></div>
        <div className='resizer bottom-right'></div>
      </div>
    </div>
  );
}

import React, { useRef, useEffect } from "react";


export const Draggable = ({ children }) => {

  const elemRef = useRef(null);

  let state = { distX: 0, distY: 0 };
  let selectedElement = false;

  useEffect(() => {
    const elem = elemRef.current;
    elem.addEventListener('mousedown', startDrag);
    elem.addEventListener('mousemove', drag);
    elem.addEventListener('mouseup', endDrag);
    elem.addEventListener('mouseleave', endDrag);
    

    return () => {

      elem.removeEventListener('mousedown', startDrag);
      elem.removeEventListener('mousemove', drag);
      elem.removeEventListener('mouseup', endDrag);
      elem.removeEventListener('mouseleave', endDrag);
    }
  });


  function startDrag(evt) {
    if (evt.target.classList.contains("draggable")) {
      state.distX = Math.abs(elemRef.current.offsetLeft - evt.clientX);
      state.distY = Math.abs(elemRef.current.offsetTop - evt.clientY);
      selectedElement = evt.target;
      elemRef.current.style.position = "absolute";
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      elemRef.current.style.left = `${evt.clientX - state.distX}px`;
      elemRef.current.style.top = `${evt.clientY - state.distY}px`;
    }
  }

  function endDrag(evt) {
    selectedElement = null;
    elemRef.current.style.position = "absolute";
  }

  function startResizeing(evt){
    if (evt.target.classList.contains("resize")) {
      state.distX = Math.abs(elemRef.current.offsetWidth - evt.clientX);
      state.distY = Math.abs(elemRef.current.offsetHeight - evt.clientY);
      selectedElement = evt.target;
    }
  }
  function resizeing(evt){
    if (selectedElement) {
      evt.preventDefault();
      elemRef.current.style.width = `${evt.clientX - state.distX}px`;
      elemRef.current.style.height = `${evt.clientY - state.distY}px`;
    }
  }
  function endResizeing(e){
    endDrag(e);
  }

  return (
    <div>
      <div ref={elemRef} className="box draggable">
        {children}
        <div 
        className="resize"
          onMouseDown={startResizeing}
          onMouseMove={resizeing}
          onMouseUp={endResizeing}
          onMouseLeave={endResizeing}
        ></div>
      </div>
    </div>
  );
}