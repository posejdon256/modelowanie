import { getSurfaces } from "../Surface/Surface";


export function findConnection() {
    const selectedSurfaces = getSurfaces("C0").filter(x => x.selected);
    if(selectedSurfaces.length !== 3) {
        alert("Please select exactly three patches.");
        return;
    }
    const corners = [];
    for(let i = 0; i < selectedSurfaces.length; i ++) {
        let s = selectedSurfaces[i];
        corners.push(s.pointsMap[0][0]);
        corners.push(s.pointsMap[s.pointsMap.length - 1][0]);
        corners.push(s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1]);
        corners.push(s.pointsMap[0][s.pointsMap[0].length - 1]);
    }
    let first;
    let second;
    let third;
    let c1, c2;
    if((c1 = findPointConnectionsS(corners[0], selectedSurfaces[1])) !== -1) {
        first = corners[0];
        if((c2 = findPointConnectionsS(corners[1], selectedSurfaces[2])) !== -1) {
            second = corners[1];
        } else if((c2 = findPointConnectionsS(corners[3], selectedSurfaces[2])) !== -1) {
            second = corners[2];
        } else {
            alert("There is not continuity.");
            return;
        }
    } else if((c1 = findPointConnectionsS(corners[1], selectedSurfaces[1])) !== -1) {
        first = corners[1];
        if((c2 = findPointConnectionsS(corners[0], selectedSurfaces[2])) !== -1) {
            second = corners[0];
        } else if((c2 = findPointConnectionsS(corners[2], selectedSurfaces[2])) !== -1) {
            second = corners[2];
        } else {
            alert("There is not continuity.");
            return;
        }
    } else if((c1 = findPointConnectionsS(corners[2], selectedSurfaces[1])) !== -1) {
        first = corners[2];
        if((c2 = findPointConnectionsS(corners[1], selectedSurfaces[2])) !== -1) {
            second = corners[1];
        } else if((c2 = findPointConnectionsS(corners[3], selectedSurfaces[2])) !== -1) {
            second = corners[3];
        } else {
            alert("There is not continuity.");
            return;
        }
    } else if((c1 = findPointConnectionsS(corners[3], selectedSurfaces[1])) !== -1) {
        first = corners[3];
        if((c2 = findPointConnectionsS(corners[0], selectedSurfaces[2])) !== -1) {
            second = corners[0];
        } else if((c2 = findPointConnectionsS(corners[2], selectedSurfaces[2])) !== -1) {
            second = corners[2];
        } else {
            alert("There is not continuity.");
            return;
        }
    } else {
        alert("Two points can't be find.");
    }
    c1 += 4;
    c2 += 8;
    third = findC1AndC2(corners, c1, c2, selectedSurfaces[1], selectedSurfaces[2]);
    return [first, second, third];

}
function findC1AndC2(corners, c1, c2, s1, s2) {
    let cHelp;
    if(c1 === 4) {
        if((cHelp = findPointConnectionsS(corners[5], s2)) !== -1) {
            if(corners[8 + cHelp] !== corners[5]) {
                alert("There is a problem with selection.");
                return null;
            }
        } else if((cHelp = findPointConnectionsS(corners[7], s2)) !== -1) {
            if(corners[8 + cHelp] !== corners[7]) {
                alert("There is a problem with selection.");
                return null;
            }
        }
    } else if(c1 === 7) {
        if((cHelp = findPointConnectionsS(corners[4], s2)) !== -1) {
            if(corners[8 + cHelp] !== corners[4]) {
                alert("There is a problem with selection.");
                return null;
            }
        } else if((cHelp = findPointConnectionsS(corners[6], s2)) !== -1) {
            if(corners[8 + cHelp] !== corners[6]) {
                alert("There is a problem with selection.");
                return null;
            }
        }
    } else {
        if((cHelp = findPointConnectionsS(corners[c1 + 1], s2)) !== -1) {
            if(corners[8 + cHelp] !== corners[c1 + 1]) {
                alert("There is a problem with selection.");
                return null;
            }
        }else if((cHelp = findPointConnectionsS(corners[c1 - 1], s2)) !== -1) {
            if(corners[8 + cHelp] !== corners[c1 - 1]) {
                alert("There is a problem with selection.");
                return null;
            }
        }
    }
    cHelp += 8;
    if(cHelp === 8) {
        if(c2 === 11 || c2 === 9) {
            return corners[cHelp];
        }
    } else if(cHelp === 11) {
        if(c2 === 10 || c2 === 9) {
            return corners[cHelp];
        }
    } else{
        if(c2 === cHelp - 1 || c2 === cHelp + 1) {
            return corners[cHelp];
        }
    }
}
function findPointConnectionsS(p, s) {
    let ret = -1;
    if(s.pointsMap[0][0].id === p.id ){
        ret = 0;
    }
    if(s.pointsMap[s.pointsMap.length - 1][0].id === p.id ){
        ret = 1;
    }
    if(s.pointsMap[0][s.pointsMap[0].length - 1].id === p.id){
        ret = 3;
    }
    if(s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1].id === p.id ) {
        ret = 2;
    }
    return ret;
}
export function findPoint1Array(surfaces, p1, p2) {
    const ret1 = [];
    const ret2 = [];
    for(let i = 0; i < surfaces.length; i ++) {
        const s = surfaces[i];
        if(s.pointsMap[0][0].id === p1.id && s.pointsMap[0][s.pointsMap[0].length - 1].id === p2.id) {
            for(let j = 0; j < s.pointsMap[0].length; j ++) {
                ret1.push(s.pointsMap[0][j]);
                ret2.push(s.pointsMap[1][j]);
            }
            break;
        }
        else if(s.pointsMap[0][0].id === p2.id && s.pointsMap[0][s.pointsMap[0].length - 1].id === p1.id) {
            for(let j = s.pointsMap[0].length - 1; j >= 0; j --) {
                ret1.push(s.pointsMap[0][j]);
                ret2.push(s.pointsMap[1][j]);
            }
            break;
        } else if(s.pointsMap[0][0].id === p1.id && s.pointsMap[s.pointsMap.length - 1][0].id === p2.id) {
            for(let j = 0; j < s.pointsMap.length; j ++) {
                ret1.push(s.pointsMap[j][0]);
                ret2.push(s.pointsMap[j][1]);
            }
            break;
        } else if (s.pointsMap[0][0].id === p2.id && s.pointsMap[s.pointsMap.length - 1][0].id === p1.id) {
            for(let j = s.pointsMap.length - 1; j >= 0; j --) {
                ret1.push(s.pointsMap[j][0]);
                ret2.push(s.pointsMap[j][1]);
            }
            break;
        } else if(s.pointsMap[s.pointsMap.length - 1][0].id === p1.id && s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1].id === p2.id) {
            for(let j = 0; j < s.pointsMap[0].length; j ++) {
                ret1.push(s.pointsMap[s.pointsMap.length - 1][j]);
                ret2.push(s.pointsMap[s.pointsMap.length - 2][j]);
            }
            break;
        } else if (s.pointsMap[s.pointsMap.length - 1][0].id === p2.id && s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1].id === p1.id) {
            for(let j = s.pointsMap[0].length - 1; j >= 0; j --) {
                ret1.push(s.pointsMap[s.pointsMap.length - 1][j]);
                ret2.push(s.pointsMap[s.pointsMap.length - 2][j]);
            }
            break;
        } else if (s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1].id === p2.id && s.pointsMap[0][s.pointsMap[0].length - 1].id === p1.id) {
            for(let j = 0; j < s.pointsMap.length; j ++) {
                ret1.push(s.pointsMap[j][s.pointsMap[0].length - 1]);
                ret2.push(s.pointsMap[j][s.pointsMap[0].length - 1]);
            }
            break;       
         } else if(s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1].id === p1.id && s.pointsMap[0][s.pointsMap[0].length - 1].id === p2.id){
            for(let j = s.pointsMap.length - 1; j >= 0; j --) {
                ret1.push(s.pointsMap[j][s.pointsMap[0].length - 1]);
                ret2.push(s.pointsMap[j][s.pointsMap[0].length - 1]);
            }
            break;
        }
    }
    return [ret1, ret2];
}