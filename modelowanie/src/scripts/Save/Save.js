import { getPoints } from "../canvas/Points/Points";
import { getCurves } from "../canvas/Bezier/Curve";
import { getSurfaces } from "../canvas/Surface/Surface";


export function Save() {
    const toruses = [];
    const ret = {};

    //points
    const points = getPoints();
    ret.points = [];
    for(let i = 0; i < points.length; i ++) {
        if(points[i].c2Bezier || points[i].visible === false)
            continue;
        ret.points.push({
            id: points[i].id,
            name: points[i].name,
            x: points[i].x * 10,
            y: points[i].y * 10,
            z: points[i].z * 10
        });
    }

    //curvesC0
    const curvesC0 = getCurves("C0");
    ret.curvesC0 = [];
    for(let i = 0; i < curvesC0.length; i ++) {
        if(curvesC0[i].surface) {
            continue;
        }
        ret.curvesC0.push({
            name: curvesC0[i].name
        });
        ret.curvesC0[i].pointsId = [];
        for(let j = 0; j < curvesC0[i].points.length; j ++) {
            ret.curvesC0[i].pointsId.push(ret.points.findIndex(x => x.id === curvesC0[i].points[j].id));
        }
    }

    //curvesC2
    const curvesC2 = getCurves("C2");
    ret.curvesC2 = [];
    for(let i = 0; i < curvesC2.length; i ++) {
        if(curvesC2[i].surface) {
            continue;
        }
        ret.curvesC2.push({
            name: curvesC2[i].name
        });
        ret.curvesC2[i].pointsId = [];
        for(let j = 0; j < curvesC2[i].pointsBspline.length; j ++) {
            ret.curvesC2[i].pointsId.push(ret.points.findIndex(x => x.id === curvesC2[i].pointsBspline[j].id));
        }
    }

    //curvesC2I
    const curvesC2I = getCurves("C2I");
    ret.curvesC2I = [];
    for(let i = 0; curvesC2I && i < curvesC2I.length; i ++) {
        ret.curvesC2I.push({
            name: curvesC2I[i].name
        });
        ret.curvesC2I[i].pointsId = [];
        for(let j = 0; j < curvesC2I[i].interpolationPoints.length; j ++) {//TODO?
            ret.curvesC2I[i].pointsId.push(ret.points.findIndex(x => x.id === curvesC2I[i].interpolationPoints[j].id));
        }
    }
    //surfacesC0
    const surfacesC0 = getSurfaces("C0");
    ret.surfacesC0 = [];
    for(let i = 0; surfacesC0 && i < surfacesC0.length; i ++) {
        ret.surfacesC0.push({
            name: surfacesC0[i].name,
            u: surfacesC0[i].px,
            v: surfacesC0[i].py,
            flakeU: (surfacesC0[i].pointsMap[0].length - 1) / 3,
            flakeV: (surfacesC0[i].pointsMap.length - 1) / 3,
            cylinder: surfacesC0[i].cylinder,
            points: []
        });
        ret.surfacesC0[i].points = [];
        for(let j = 0; j < surfacesC0[i].pointsMap.length; j ++) {
            ret.surfacesC0[i].points.push([]);
            for(let k = 0; k < surfacesC0[i].pointsMap[j].length; k ++) {
                ret.surfacesC0[i].points[j].push(ret.points.findIndex(x => x.id === surfacesC0[i].pointsMap[j][k].id));
            }
        }
    }

    //surfacesC2
    const surfacesC2 = getSurfaces("C2");
    ret.surfacesC2 = [];
    for(let i = 0; surfacesC2 && i < surfacesC2.length; i ++) {
        ret.surfacesC2.push({
            name: surfacesC2[i].name,
            u: surfacesC2[i].px,
            v: surfacesC2[i].py,
            flakeU: surfacesC2[i].pointsMap[0].length - 3,
            flakeV: surfacesC2[i].pointsMap.length - 3,
            cylinder: surfacesC2[i].cylinder,
            points: []
        });
        ret.surfacesC2[i].points = [];
        for(let j = 0; j < surfacesC2[i].pointsMap.length; j ++) {
            ret.surfacesC2[i].points.push([]);
            for(let k = 0; k < surfacesC2[i].pointsMap[j].length; k ++) {
                ret.surfacesC2[i].points[j].push(ret.points.findIndex(x => x.id === surfacesC2[i].pointsMap[j][k].id));
            }
        }
    }
    clean(ret);
    // delete points ids
    ret.points.forEach(point => {
        delete point.id;
    });

    //toruses TODO
    ret.toruses = toruses;

    saveToFile(ret);
}
function clean(ret) {
    for(let i = 0; i < ret.points.length; i ++) {
        for(let j = i + 1; j < ret.points.length; j ++) {
            if(ret.points[i].x === ret.points[j].x &&
                ret.points[i].y === ret.points[j].y &&
                ret.points[i].z === ret.points[j].z
            ) {
                ret.curvesC0.forEach(c => {
                    for(let k = 0; k < c.pointsId.length; k ++) {
                        if(c.pointsId[k] === j) {
                            c.pointsId[k] = i;
                        }
                    }
                });
                ret.curvesC2.forEach(c => {
                    for(let k = 0; k < c.pointsId.length; k ++) {
                        if(c.pointsId[k] === j) {
                            c.pointsId[k] = i;
                        }
                    }
                });
                ret.curvesC2I.forEach(c => {
                    for(let k = 0; k < c.pointsId.length; k ++) {
                        if(c.pointsId[k] === j) {
                            c.pointsId[k] = i;
                        }
                    }
                });
                ret.surfacesC0.forEach(s => {
                    s.points.forEach(pRow => {
                        for(let k = 0; k < pRow.length; k ++) {
                            if(pRow[k] === j) {
                                pRow[k] = i;
                            }
                        }
                    });
                });
                ret.surfacesC2.forEach(s => {
                    s.points.forEach(pRow => {
                        for(let k = 0; k < pRow.length; k ++) {
                            if(pRow[k] === j) {
                                pRow[k] = i;
                            }
                        }
                    });
                });
                ret.points[j].remove = true;
            }
        }
    }
}
function saveToFile(json) { 
        var file = new Blob([JSON.stringify(json)], {type: 'json'});
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'Project.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    // fs.writeFile("./Project.json", json, (err) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     };
    //     console.log("File has been created");
    // });
    
}