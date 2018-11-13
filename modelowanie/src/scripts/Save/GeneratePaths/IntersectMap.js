import { setCursor } from '../../canvas/Cursor/Cursor';
import { trim } from '../../canvas/CuttingCurve/Trimming';
import { getUVImages, RedrawVisualization, setSettedStart } from '../../canvas/Draw/RedrawVisualisation/RedrawVisualization';
import { selectSurface } from '../../canvas/Surface/Surface';
import { getTrimConfiguration } from './ConfigurationTrim';

const width = 500;
export function createIntersectMap(id) {
    const configuration = getTrimConfiguration();
    if(configuration[id] === 'all') {
        return undefined;
    }
    const _map = initalizeMap();
    selectSurface(id);
    const sConf = configuration[id];
    for(let i = 0; i < sConf.intersections.length; i ++) {
        const inter = sConf.intersections[i];
        selectSurface(inter.id);
        setCursor(inter.cursor.x, inter.cursor.y, inter.cursor.z, false);
        setSettedStart(undefined, undefined, inter.trimP.x, inter.trimP.y);
        trim('all', 'right');
        RedrawVisualization();
        const canvas = getUVImages().canvas2;
        const ctx = canvas.getContext('2d');
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for(let j = 0; j < width; j ++) {
            for(let k = 0; k < width; k ++) {
                const place = (j * canvas.width * 4) + (k * 4);
                if(img.data[place] === 0) {
                    _map[k][j] = 0;
                }
    
            }
        }
        selectSurface(inter.id);
    }
    selectSurface(id);
    return _map;

}
export function initalizeMap() {
    const _map = [];
    for(let i = 0; i < width; i ++) {
        _map.push([]);
        for(let j = 0; j < width; j ++) {
            _map[i].push(1);
        }
    }
    return _map;
}