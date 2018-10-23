
let points = [];
let type = { k: true, mm: 10 };

export function readMill(_path) {
    var reader = new FileReader();
    const _typeStr = _path[0].name.split('.')[1];
    type.k = _typeStr[0] === 'k' ? true : false;
    type.mm = parseInt(_typeStr.substr(1, _typeStr.length), 10) / 200;
   // generateMill();
    reader.onload = (function(theFile) {
        return function(e) {
            try{
                const result = e.target.result;
                const _result =  result.slice(37, result.length);
                const file = atob(_result);
                parseMill(file);
            } catch(error) {
                console.log(error);
            }
        }
    })(_path[0]);
    reader.readAsDataURL(_path[0]);
}
function parseMill(file) {
    const lines = file.split(/\r?\n|\r/);
    points = [];
    lines.forEach(line => {
        const pointArray = line.split(/X|Y|Z/);
        const point = {x: parseFloat(pointArray[1]) / 100, y: parseFloat(pointArray[2]) / 100, z: parseFloat(pointArray[3]) / 100};
        points.push(point);
    });
}
export function getPointsToDrill() {
    return points;
}
export function getDrillSpecification() {
    return type;
}