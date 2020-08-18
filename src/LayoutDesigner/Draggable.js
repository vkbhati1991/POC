import React, { useRef, useEffect, useState } from "react";

function makeResizableDiv(element, resizers) {

  if (!element || !resizers) return;

  const minimum_size = 20;
  let original_height = 0;
  let original_mouse_y = 0;

  function startResize(e) {
    e.preventDefault()
    
    original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
    original_mouse_y = e.pageY;
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
  }

  function resize(e) {
    if (resizers.classList.contains('bottom-right')) {
      const height = original_height + (e.pageY - original_mouse_y)
      if (height > minimum_size) {
        element.style.height = height + 'px'
      }
    }
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize)
  }
  resizers.addEventListener('mousedown', startResize);

}

export const Draggable = (props) => {

  const elemRef = useRef(null);
  const resizeElemRef = useRef(null);
  const [flex, setflex] = useState(50);

  useEffect(() => {
    const element = elemRef && elemRef.current;
    const resizers = resizeElemRef && resizeElemRef.current;
    makeResizableDiv(element, resizers);
  });

  function getWidth (flex){
    return `${flex}%`;
  }

  return (
    <div className='resizable cells' rowid={props.rowid} cellid={props.cellId} style={{width:getWidth(flex), maxWidth:getWidth(flex), minWidth: getWidth(flex)}} ref={elemRef}>
       <select defaultValue={flex} onChange={(e)=>{
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
        <div className='resizer bottom-right' ref={resizeElemRef}></div>
    </div>
  );
}