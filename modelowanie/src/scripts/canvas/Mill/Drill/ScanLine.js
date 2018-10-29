import { convertFromPlaceToIndex, convertFromIndexToPlace } from "../Material/Drilling";

export function ScanLine(corners, lines) {
    const points = [];
    const y_min = findMin(corners);
    const y_max = findMax(corners);

    for(let y = y_min; y <= y_max; y ++) {
        let x_s = [];
        lines.forEach(l => {
            if(l.a === Infinity || l.a === -Infinity) {
                x_s.push(l.xmin);
                x_s.push(l.xmax);
            } else {
                const helper = convertFromIndexToPlace(0, y, undefined);
                const x = convertFromPlaceToIndex({x: -(l.b - helper.y) / l.a, y:0, z: undefined}).x;
                if(x >= l.xmin && x <= l.xmax) {
                    x_s.push(x);
                }
            }
        });
        x_s = sort_unique(x_s);
        for(let x = 1; x < x_s.length; x ++) {
            for(let i = x_s[x - 1]; i < x_s[x]; i ++) {
                    points.push({x: i, y: y, z: corners[0].z});
            }
            
        }
    }
    return points;
}
function sort_unique(arr) {
    if (arr.length === 0) return arr;
    arr = arr.sort(function (a, b) { return a*1 - b*1; });
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
      if (arr[i-1] !== arr[i]) {
        ret.push(arr[i]);
      }
    }
    return ret;
  }
function findMin(corners) {
    const y_min = {
        index: -1,
        value: 100000
    };
    for(let i = 0; i < corners.length; i ++) {
        if(corners[i].y < y_min.value) {
            y_min.value = corners[i].y;
            y_min.index = i;
        }
    }
    return y_min.value;

}
function findMax(corners) {
    const y_max = {
        index: -1,
        value: -100000
    };
    for(let i = 0; i < corners.length; i ++) {
        if(corners[i].y > y_max.value) {
            y_max.value = corners[i].y;
            y_max.index = i;
        }
    }
    return y_max.value;
}