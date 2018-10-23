import { getMaterial } from "../Material/Material";

export function Bresenham (x1, y1, x2, y2, index) {
    var coordinatesArray = new Array();
    if(isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2) ||
      x1 < 0 || x2 < 0 || y1 < 0 || y2 < 0) {
        return [];
    }

    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    let x = x1;
    let y = y1;
    if(index === 1) {
      coordinatesArray.push({x: x, y: y, banana1: true});
    }
    // Main loop
    let i = 0;
    while (!((x == x2) && (y == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      else if (e2 < dx) {
        err += dx;
        y += sy;
      }
      // Set coordinates
      coordinatesArray.push({x: x, y: y, banana1: index !== 1 ? true : false});
      i ++;
    }
    // Return the result
    return coordinatesArray;
  }
  export function updateZInBrezenhamy(p1, p2, brezenhamy) {
    const step = (p2.z - p1.z) / brezenhamy.length;
    let food = 0;
    for(let i = 0; i < brezenhamy.length; i ++) {
      brezenhamy[i].z = p1.z + food;
      food += step;
    }
    return brezenhamy;
  }