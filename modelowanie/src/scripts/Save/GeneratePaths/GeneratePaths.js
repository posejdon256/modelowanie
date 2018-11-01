import { isHelicopterLoaded } from "../../Load/Load";

export function generatePaths() {
    if(!isHelicopterLoaded()) {
        alert("Load helicopter!");
        return false;
    }
    const map = generateMap(1500, 1500);
    alert('Generated!');
}
function generateMap(n, m) {
    const _map = [];
    for(let i = 0; i < n; i ++) {
        _map.push([]);
        for(let j = 0; j < m; j ++) {
            _map[i].push(0);
        }
    }
    return _map;
}