import { treeFormater } from "./TreeFormater";


export const getValue = function (row, col) {

    if (!col.Key) return;

    let value = row.data[col.Key];

    if (col.Type === treeFormater.URL) {
        value = value.Title
    }

    return value.length > 14 ? `${value.substring(0, 14)}...` : value;
}


export const getLinkUrl = (d, col) => {

    if (!d) return;

    let url = d.data.Url;

    if (col.Type === treeFormater.URL) {
        const valueObject = d.data[col.Key];

        url = valueObject.Url
    }

    return url;
}