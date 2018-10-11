export function readMill(_path) {
    var reader = new FileReader();
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
    const points = [];
    lines.forEach(line => {
        const pointArray = line.split(/X|Y|Z/);
        const point = {x: parseFloat(pointArray[1]), y: parseFloat(pointArray[2]), z: parseFloat(pointArray[3])};
        points.push(point);
    });
}