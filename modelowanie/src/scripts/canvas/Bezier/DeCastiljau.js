export function deCastiljau(t, p1, p2, p3, p4) {
    const tPrim = (1 - t);

    const p1Prim = {x : (p1.x * tPrim) + (p2.x * t), y: (p1.y * tPrim) + (p2.y * t), z: (p1.z * tPrim) + (p2.z * t)};
    const p2Prim = {x : (p2.x * tPrim) + (p3.x * t), y: (p2.y * tPrim) + (p3.y * t), z: (p2.z * tPrim) + (p3.z * t)};
    const p3Prim = {x : (p3.x * tPrim) + (p4.x * t), y: (p3.y * tPrim) + (p4.y * t), z: (p3.z * tPrim) + (p4.z * t)};
    
    const p1Bis = {x : (p1Prim.x * tPrim) + (p2Prim.x * t), y: (p1Prim.y * tPrim) + (p2Prim.y * t), z: (p1Prim.z * tPrim) + (p2Prim.z * t)};
    const p2Bis = {x : (p2Prim.x * tPrim) + (p3Prim.x * t), y: (p2Prim.y * tPrim) + (p3Prim.y * t), z: (p2Prim.z * tPrim) + (p3Prim.z * t)};

    return {x : (p1Bis.x * tPrim) + (p2Bis.x * t), y: (p1Bis.y * tPrim) + (p2Bis.y * t), z: (p1Bis.z * tPrim) + (p2Bis.z * t)};
}