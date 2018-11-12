const s1 = 'all';
const s2 = 'all';
const s3 = {
    id: 3,
    intersections:[
    {
        id: 2,
        cursor: {x: 0.1, y: -0.05, z: 0},
        trimP: {x: 450, y:450}
    }
]};
const s4 = 'all';
const s5 = {
    id: 5,
    intersections: [
        {
            id: 1,
            cursor: {x: -0.1, y:-0.36, z: 0.0},
            trimP: {x: 450, y: 450}
        },
        {
            id: 2,
            cursor: {x: -0.12, y:-0.15, z: 0.0},
            trimP: {x: 10, y: 10}
        }
    ]
};
const s6 = 'all';
//     id: 6,
//     intersections:[
//         {
//             id: 2,
//             cursor: {x: -0.1, y: 0.2, z: 0},
//             trimP: {x: 450, y:450}
//         },
//         {
//             id: 2,
//             cursor: {x: -0.17, y: 0.2, z: 0},
//             trimP: {x: 50, y:50}
//         },
//         {
//             id: 4,
//             cursor: {x: -0.27, y: 0.43, z: 0.04},
//             trimP: {x: 450, y:450}
//         },
//         {
//             id: 4,
//             cursor: {x: -0.03, y: 0.46, z: -0.04},
//             trimP: {x: 50, y:50}
//         },
// ]};;

export function getTrimConfiguration() {
    return [undefined, s1, s2, s3, s4, s5, s6];
}