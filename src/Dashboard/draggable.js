

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

    const cw = container.offsetWidth - 16 - w;
    const ch = container.offsetHeight - 16 - h;

    const cwidth = container.offsetWidth - 16 - l;
    const cheight = container.offsetHeight - 16 - t;

    const gridItemWidth = (container.offsetWidth / 12);

    const hasMoved = () => !(t === this.offsetTop && l === this.offsetLeft);

    const hasResized = () => !(w === this.offsetWidth && h === this.offsetHeight);

    const follow = e => {

        // Set top/left of element according to mouse position
        let topPos = e.pageY + y - h;
        let leftPos = e.pageX + x - w;

         // Calculate Left position
         const boxNumX = Math.floor((leftPos /  Math.floor(gridItemWidth)));
         const tempLeftPos = boxNumX * (gridItemWidth);
         leftPos = Math.floor(tempLeftPos + 16 - boxNumX);
 
         // Calculate Top position
         const boxNumY = Math.floor(topPos / 48);
         const tempTopPos = (boxNumY * (48 + 16));
         topPos = tempTopPos + 16;

        if (topPos < 16) topPos = 16;
        if (topPos > ch) topPos = ch;
        if (leftPos < 16) leftPos = 16;
        if (leftPos > cw) leftPos = cw;

        this.style.top = `${topPos}px`;
        this.style.left = `${leftPos}px`;
    };

    const resize = e => {

        // Set width/height of element according to mouse position
        let width = e.pageX - l + x;
        let height = e.pageY - t + y;

        const boxNumX = Math.floor((width /  Math.floor(gridItemWidth))) + 1;
        // const tempWidth = (boxNumX + 1) * (gridItemWidth);
        // width = tempWidth - boxNumX - 16;

        const boxNumY = Math.floor(height / 48);
        //const tempheight = (boxNumY * (48 + 16));
        //height = tempheight - 16;
        
        if (width >= cwidth) width = cwidth;
        if (height >= cheight) height = cheight;
        
        this.style.width = `${width}px`;
        this.style.height = `${height}px`;

        this.attributes["data-gs-width"].value = boxNumX;
        this.attributes["data-gs-height"].value = boxNumY;
    };


    const unresize = e => {
        // Remove listeners that were bound to document
        document.removeEventListener('mousemove', resize);
        document.removeEventListener("mouseup", unresize);

        this.style.width = "";
        this.style.height = ""

        // Emit events according to interaction
        if (hasResized(e)) this.dispatchEvent(new Event('resized')); else
            this.dispatchEvent(new Event('clicked'));
        e.preventDefault();
    };

    const unfollow = e => {
        // Remove listeners that were bound to document
        document.removeEventListener('mousemove', follow);
        document.removeEventListener("mouseup", unfollow);
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


export default draggable;