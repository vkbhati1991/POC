export const getRectBgColor = function (d, depthHeight) {

    if (d.depth === 0) {
        return "#39b54a";
    }

    if (d.depth === depthHeight) {
        return "#836891"
    }

    return "#00a99d"
}