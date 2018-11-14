import { setCursor } from '../../../canvas/Cursor/Cursor';
import { findObjectToIntersectionAndIntersection } from '../../../canvas/CuttingCurve/FindIntersection';
import { selectSurface } from '../../../canvas/Surface/Surface';
import { getConfigurationCut } from './ConfigurationCut';
import { initalizeMap } from '../IntersectMap';

export function createCuttingCurvesFoFlatMill() {
    const sConf = getConfigurationCut();
    const _map = initalizeMap();
    selectSurface(sConf.id);
    let startPoint;
    for (let i = 0; i < sConf.intersections.length; i++) {
        const inter = sConf.intersections[i];
        selectSurface(inter.id);
        setCursor(inter.cursor.x, inter.cursor.y, inter.cursor.z, false);
        if (!findObjectToIntersectionAndIntersection()) {
            console.log('problem with intersecion place');
            continue;
        }
        selectSurface(inter.id);
    }
    selectSurface(sConf.id);
    return {_map: _map, startPoint: startPoint};
}