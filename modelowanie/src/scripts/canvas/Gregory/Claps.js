import { getPoints, removePoint } from "../Points/Points";
import { getSurfaces } from "../Surface/Surface";
import Redraw from "../Draw/Redraw";
import { RemoveCatchPoint } from "../Move/MoveCursor";

export function uniteTwoPoints() {
    const points = getPoints();
    const selectedPoints = points.filter(x => x.selected);
    if(selectedPoints.length !== 2) {
        alert("Muszą być zaznaczone dokładnie dwa punkty!");
        return;
    }
    const foundPoints = [];
    selectedPoints.forEach(p => {
        let fromC0Corner = false;
        const surfaces = getSurfaces("C0");
        for(let i = 0; i < surfaces.length; i ++) {
            let s = surfaces[i];
            if(s.cylinder) 
                continue;
            if(s.pointsMap[s.pointsMap.length - 1][0].id === p.id ||
                s.pointsMap[0][s.pointsMap[0].length - 1].id === p.id ||
                s.pointsMap[0][0].id === p.id ||
                s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1].id === p.id
            ) {
                fromC0Corner = true;
                if(foundPoints.length === 0) {
                    foundPoints.push(p);
                    break;
                }
                if(s.pointsMap[s.pointsMap.length - 1][0].id === p.id) {
                    s.pointsMap[s.pointsMap.length - 1][0] = foundPoints[0];
                } else if(s.pointsMap[0][s.pointsMap[0].length - 1].id === p.id) {
                    s.pointsMap[0][s.pointsMap[0].length - 1] = foundPoints[0];
                } else if(s.pointsMap[0][0].id === p.id) {
                    s.pointsMap[0][0] = foundPoints[0];
                } else if(s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1].id === p.id) {
                    s.pointsMap[s.pointsMap.length - 1][s.pointsMap[0].length - 1] = foundPoints[0];
                }
                foundPoints[0].x = (foundPoints[0].x + p.x) / 2;
                foundPoints[0].y = (foundPoints[0].y + p.y) / 2;
                foundPoints[0].z = (foundPoints[0].z + p.z) / 2;
                p.surface = false;
                foundPoints[0].selected = false;
                RemoveCatchPoint(foundPoints[0]);
                removePoint(p.id);
                break;
            }
        }
        if(!fromC0Corner) {
            alert("Wybrałeś punkt który nie jest na rogu płaskiego bikubicznego płata C0");
            return;
        }
    });
    Redraw();
}