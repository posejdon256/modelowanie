const s1 = {
    id: 1,
    intersections:[
    {
        id: 5,
        cursor: {x: -0.11, y: -0.37, z: 0.02},
        back: false
    }
]};
const s2 = {
    id: 2,
    intersections:[
    {
        id: 5,
        cursor: {x: 0.01, y: -0.16, z: 0},
        back: false
    },
    {
        id: 3,
        cursor: {x: 0.16, y: -0.06, z: 0.0},
        back: true
    },
    {
        id: 6,
        cursor: {x: -0.11, y: 0.19, z: 0},
       back: false
    },
    {
        id: 6,
        cursor: {x: -0.04, y: 0.08, z: -0.29},
        back: false
    },
]};
const s3 = 'all';
const s4 = {
    id: 4,
    intersections: [
        {
            id: 6,
            cursor: {x: -0.18, y: 0.41, z: 0.04},
            back: false
        },
        {
            id: 6,
            cursor: {x: 0.04, y: 0.41, z: 0.04},
            back: false
        }
    ]
};
const s5 = 'all';
const s6 = 'all';
export function getLastIntersectionsConfiguration() {
    return [undefined, s1, s2, s3, s4, s5, s6];
}