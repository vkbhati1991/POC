import React, { useRef, useEffect } from 'react';
// import draggable from "./draggable";


const DragElem = (props) => {
    const elem = useRef(null);
    const { data_id, data_gs_x, data_gs_y, data_gs_width, data_gs_height, removeComponent, setElemProps } = props;

    const draggable = function (e) {

        // container of Elements
        const container = document.getElementById("grd-drag");

        // Elements initial width and height
        const h = this.offsetHeight;
        const w = this.offsetWidth;
        // Elements original position
        const t = this.offsetTop;
        const l = this.offsetLeft;
        // Click position within element
        const y = t + h - e.pageY;
        const x = l + w - e.pageX;

        let tt = null;
        let ll = null;

        const cw = container.offsetWidth - 16 - w;
        const ch = container.offsetHeight - 16 - h;

        const cwidth = container.offsetWidth - 16 - l;
        const cheight = container.offsetHeight - 16 - t;

        const gridItemWidth = (container.offsetWidth / 12);

        let updatedElemOnResize = {
            data_id: data_id,
            data_gs_width: data_gs_width || 3,
            data_gs_height: data_gs_height || 4
        }

        let updatedElemOnMove = {
            data_id: data_id,
            data_gs_x: data_gs_x || 1,
            data_gs_y: data_gs_y || 1
        }

        const hasMoved = () => !(t === this.offsetTop && l === this.offsetLeft);

        const hasResized = () => !(w === this.offsetWidth && h === this.offsetHeight);

        const follow = e => {

            // Set top/left of element according to mouse position
            let topPos = e.pageY + y - h;
            let leftPos = e.pageX + x - w;

            if (topPos < 16) topPos = 16;
            if (topPos > ch) topPos = ch;
            if (leftPos < 16) leftPos = 16;
            if (leftPos > cw) leftPos = cw;

            // Calculate Left position
            const boxNumX = Math.floor((leftPos / Math.floor(gridItemWidth))) + 1;

            // Calculate Top position
            const boxNumY = Math.floor(topPos / (48+16)) + 1;

            this.style.top = `${topPos}px`;
            this.style.left = `${leftPos}px`;

            tt = this.offsetTop;
            ll = this.offsetLeft;

            updatedElemOnMove.data_gs_x = boxNumX;
            updatedElemOnMove.data_gs_y = boxNumY;
        };

        const resize = e => {

            // Set width/height of element according to mouse position
            let width = e.pageX - l + x;
            let height = e.pageY - t + y;

            const boxNumX = Math.floor((width / Math.floor(gridItemWidth))) + 1;

            let boxNumY = Math.floor((height) / 64) + 1;

            if (width >= cwidth) width = cwidth;
            if (height >= cheight) height = cheight;

            this.style.width = `${width}px`;
            this.style.height = `${height}px`;

            updatedElemOnResize.data_gs_width = boxNumX;
            updatedElemOnResize.data_gs_height = boxNumY >= 15 ? 15 : boxNumY;
        };


        const unresize = e => {
            // Remove listeners that were bound to document
            document.removeEventListener('mousemove', resize);
            document.removeEventListener("mouseup", unresize);

            this.style.width = "";
            this.style.height = "";
            !hasResized() && setElemProps(updatedElemOnResize);

            // Emit events according to interaction
            if (hasResized(e)) this.dispatchEvent(new Event('resized')); else
                this.dispatchEvent(new Event('clicked'));
            e.preventDefault();
        };

        const unfollow = e => {
            // Remove listeners that were bound to document
            document.removeEventListener('mousemove', follow);
            document.removeEventListener("mouseup", unfollow);

            this.style.top = "";
            this.style.left = "";

            if (tt || ll) setElemProps(updatedElemOnMove);

            // Emit events according to interaction
            if (hasMoved(e)) this.dispatchEvent(new Event('moved')); else
                this.dispatchEvent(new Event('clicked'));
            e.preventDefault();
        };

        // Add follow listener if not resizing
        if (x > 16 && y > 16) {
            document.addEventListener("mousemove", follow);
            document.addEventListener("mouseup", unfollow);
            e.preventDefault();
        } else {
            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", unresize);
            e.preventDefault();
        }
    };

    /* eslint-disable*/
    useEffect(() => {
        if (!elem) return;
        elem.current.addEventListener("mousedown", draggable);

    }, [elem]);

    return (
        <div
            data-id={data_id}
            data-gs-x={data_gs_x}
            data-gs-y={data_gs_y}
            data-gs-width={data_gs_width}
            data-gs-height={data_gs_height}
            className="dd grid-stack-item"
            ref={elem}>
            <div className="cardssss">
                <div className="card-header">Lead Card <span className="remove" onClick={(e) => { removeComponent(e, data_id) }}>Remove</span></div>
                <div className="card-bodys">The following example shows how to get a three equal-width columns starting at tablets and scaling to large desktops. On mobile phones or screens that are less than 768px wide, the columns will automatically stack:</div>
            </div>
            <div className="dragelem"></div>
        </div>
    );
}

export default DragElem;