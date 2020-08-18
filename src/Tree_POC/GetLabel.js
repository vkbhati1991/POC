export const getLabel = function (key) {

    if (!key) return;

    const label = key.Title;

    return label && label.length > 12 ? `${label.substring(0, 12)}...` : label;
};
