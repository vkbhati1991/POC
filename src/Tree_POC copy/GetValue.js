
export const getValue = function (row, col) {

    if (!col.Key) return;

    let value = row[col.Key];

    if (col.Type === 6) {
        value = value.Title;
    }

    return value && value.length > 14 ? `${value.substring(0, 14)}...` : value;
};
