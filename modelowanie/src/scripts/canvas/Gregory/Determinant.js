

export function countK0AndH0(g, c, b) {
    let number = 0;
    let W = countW(g.x, g.y, c.x, c.y);
    let Wx, Wy;
    if(W === 0) {
        number = 1;
        W = countW(g.y, g.z, c.y, c.z);
    }
    if(W === 0) {
        number = 2;
        W = countW(g.x, g.z, c.x, c.z);
    }
    if(number === 0) {
        Wx = countW(b.x, b.y, c.x, c.y);
        Wy = countW(g.x, g.y, b.x, b.y);
    } else if(number === 1) {
        Wx = countW(b.y, b.z, c.y, c.z);
        Wy = countW(g.y, g.z, b.y, b.z);
    } else {
        Wx = countW(b.x, b.z, c.x, c.z);
        Wy = countW(g.x, g.z, b.x, b.z);
    }
    return { k: Wx/W, h: Wy/W };
}
function countW(g1, g2, c1, c2) {
    return g1 * c2 - g2 * c1;
}