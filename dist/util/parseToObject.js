"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseToObject(data) {
    const result = [];
    const dataArray = data.split('\n');
    const emptyIndex = dataArray.indexOf('');
    dataArray.splice(emptyIndex, 1);
    data.split('\n').map(item => {
        if (item !== '') {
            const obj = JSON.parse(item);
            result.push(obj);
        }
    });
    return result;
}
exports.default = parseToObject;
//# sourceMappingURL=parseToObject.js.map