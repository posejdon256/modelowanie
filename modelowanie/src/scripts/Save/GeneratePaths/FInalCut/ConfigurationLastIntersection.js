const s1 = {
    id: 1,
    cross: false,
    intersections:[
    {
        cross: true,
        id: 5,
        cursor: {x: -0.04, y: -0.37, z: -0.05},
        back: false
    }
]};
const s2 = {
    id: 2,
    cross: false,
    intersections:[
    {
        cross: true,
        id: 5,
        cursor: {x: 0.01, y: -0.16, z: 0},
        back: false
    },
    {
        cross: false,
        id: 3,
        cursor: {x: 0.06, y: -0.07, z: 0.18},
        back: true
    },
    {
        cross: false,
        id: 6,
        cursor: {x: -0.11, y: 0.19, z: 0},
       back: false
    },
    {
        cross: false,
        id: 6,
        cursor: {x: -0.04, y: 0.08, z: -0.29},
        back: false
    },
]};
const s3 = 'all';
const s5 = 'all';
const s6 = 'all';
export function getLastIntersectionsConfiguration() {
    return [undefined, s1, s2, s3, s4, s5, s6];
}
const s1m = {
    id: 1,
    cross: false,
    intersections:[
    {
        cross: true,
        id: 5,
        cursor: {x: -0.04, y: -0.37, z: -0.05},
        back: false
    }
]};
const s2m = {
    id: 2,
    cross: false,
    intersections:[
    {
        cross: true,
        id: 5,
        cursor: {x: 0.01, y: -0.16, z: 0},
        back: false
    },
    {
        cross: false,
        id: 3,
        cursor: {x: 0.17, y: -0.11, z: -0.16},
        back: true
    },
    {
        cross: false,
        id: 6,
        cursor: {x: 0.0, y: 0.23, z: 0.0},
       back: false
    },
    {
        cross: false,
        id: 6,
        cursor: {x: -0.15, y: 0.23, z: 0.0},
        back: false
    },
]};
const s4 = {
    id: 4,
    cross: false,
    intersections: [
        {
            id: 6,
            cross: false,
            cursor: {x: -0.09, y: 0.34, z: -0.04},
            back: false
        },
        {
            id: 6,
            cross: false,
            cursor: {x: -0.02, y: 0.34, z: -0.04},
            back: false
        }
    ]
};
export function getLastIntersectionsConfigurationMill() {
    return [undefined, s1m, s2m, s3, s4, s5, s6];
}
const s7 = {
    id: 7,
    cross: false,
    intersections: [
        {
            id: 6,
            cross: false,
            cursor: {x:-0.3, y:0.28, z:0.00},
        },
        {
            id: 4,
            cross: false,
            cursor: {x: 0.10, y: 0.35, z: 0.0},
        },
        {
            id: 1,
            cross: false,
            cursor: {x: 0.17, y: -0.44, z: -0.01},
        },
        {
            id: 5,
            cross: false,
            cursor: {x: 0.07, y: -0.29, z: 0.0},
        }
]
};
export function getCutBetweenLegsConfiguration() {
    return s7;
}