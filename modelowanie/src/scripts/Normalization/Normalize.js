export default function normalizeVector(vector) {
    return [
        vector[0]/vector[3],
        vector[1]/vector[3],
        vector[2]/vector[3],
        vector[3]/vector[3]
    ];
}