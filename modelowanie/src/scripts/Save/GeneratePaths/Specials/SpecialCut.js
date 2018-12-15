import { getConfigurationSpecials } from "./ConfiguarationSpecialCut";
import { createFiles } from "../Helpers/GeneratePathsHelper";
import { SumPoints } from "../../../Helpers/Helpers";

export function generatePaths4() {
    const {mountains, stars} = getConfigurationSpecials();
    let points  = [];
    points = points.concat(mountains);

    for(let i = 0; i < stars.length; i ++) {
        points.push(stars[i]);
    }
    for(let i = 0; i < stars.length; i ++) {
        points.push(SumPoints(stars[i], {x: -0.5, y: -0.4, z: 0}));
    }
    for(let i = 0; i < stars.length; i ++) {
        points.push(SumPoints(stars[i], {x: -1, y: 0.1, z: 0}));
    }


    points.forEach(p => {
        p.x = (p.x + 7) * 14;
        p.y = (p.y - 4) * 14;
    });
   points.forEach(p => {
        p.x = -p.x;
        p.z = p.z !== 0.6 ? 0.19 * 100 : p.z * 100;
    });
    points[0] = {x: 0, y: 0, z: 60};
    points.push({x: 0, y: 0, z: 60});
   createFiles(points, "k01");
    return getConfigurationSpecials();
}