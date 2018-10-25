import { crossMultiply, normalize, DiffPoints } from "../../Helpers/Helpers";
import { getMaterial } from "./Material/Material";

export function getNormalVector(a, b, c) {
    const { material } = getMaterial();
    let vec = crossMultiply(DiffPoints(material[a], material[b]), DiffPoints(material[c], material[b]));
    return normalize(vec);
}