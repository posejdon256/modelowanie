export function getNewPoint(p, pOld, map) {
    let pNew = D(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    pNew = RD(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    pNew = R(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    pNew = RT(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    pNew = T(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    pNew = LT(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    pNew = L(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    pNew = LD(p.x, p.y, map);
    if (pNew && (pNew.x !== pOld.x || pNew.y !== pOld.y)) {
        return pNew;
    }
    alert('Problem');
    return false;
}

function check(ret, x, y, map) {
    if (map[x][y] !== 0) {
        ret = false;
    }
    return ret;
}
function D(x, y, map) {
    let ret = { x: x, y: y + 1 };
    if (y + 1 >= map.length) {
        ret = false;
    }
    return check(ret, x, y + 1, map);
}
function T(x, y, map) {
    let ret = { x: x, y: y - 1 };
    if (y - 1 < 0) {
        ret = false;
    }
    return check(ret, x, y - 1, map);
}
function L(x, y, map) {
    let ret = { x: x - 1, y: y };
    if (x - 1 < 0) {
        ret = false;
    }
    return check(ret, x - 1, y, map);
}
function R(x, y, map) {
    let ret = { x: x + 1, y: y };
    if (x + 1 >= map.length) {
        ret = false;
    }
    return check(ret, x + 1, y, map);
}
function RT(x, y, map) {
    let ret = { x: x + 1, y: y + 1 };
    if (x + 1 >= map.length) {
        ret = false;
    }
    if (y + 1 >= map.length) {
        ret = false;
    }
    return check(ret, x + 1, y + 1, map);
}
function RD(x, y, map) {
    let ret = { x: x + 1, y: y - 1 };
    if (x + 1 >= map.length) {
        ret = false;
    }
    if (y - 1 < 0) {
        ret = false;
    }
    return check(ret, x + 1, y + 1, map);
}
function LD(x, y, map) {
    let ret = { x: x - 1, y: y - 1 };
    if (x - 1 < 0) {
        ret = false;
    }
    if (y - 1 < 0) {
        ret = false;
    }
    return check(ret, x - 1, y + 1, map);
}
function LT(x, y, map) {
    let ret = { x: x - 1, y: y + 1 };
    if (x - 1 < 0) {
        ret = false;
    }
    if (y + 1 >= map.length) {
        ret = false;
    }
    return check(ret, x - 1, y + 1, map);
}
