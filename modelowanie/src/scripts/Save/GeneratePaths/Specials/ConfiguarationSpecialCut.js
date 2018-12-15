const mountains = [
    //mountain 1
    {x:0, y:0, z:0.6},
    {x:-3.8000000000000016, y:1.1999999999999997, z:0.6},
    {x:-3.8000000000000016, y:1.1999999999999997, z:0},
    {x:-3.5000000000000013,y:0.5,z:0},
    {x:-3.100000000000001,y:0.8999999999999999,z:0},
    {x:-3.100000000000001,y:0.8999999999999999,z:0.6},
    //mountain 2
    {x:-3.300000000000001,y:0.7000000000000001,z:0.6},
    {x:-3.300000000000001,y:0.7000000000000001,z:0},
    {x:-2.900000000000001,y:0.09999999999999996,z:0},
    {x:-2.4000000000000004,y:0.7000000000000001,z:0},
    {x:-2.4000000000000004,y:0.7000000000000001,z:0.6},
    //mountain 3
    {x:-2.6000000000000005,y:1.0999999999999999,z:0.6},
    {x:-2.6000000000000005,y:1.0999999999999999,z:0},
    {x:-2.1,y:0.3,z:0},
    {x:-1.7999999999999998,y:0.8,z:0},
    {x:-1.7999999999999998,y:0.8,z:0.6},
];
const stars = [
    {x:-2.45,y:-0.2,z:0.6},
    {x:-2.45,y:-0.2,z:0},
    {x:-2.55,y:0,z:0},
    {x:-2.33,y:-0.14,z:0},
    {x:-2.57,y:-0.14,z:0},
    {x:-2.35,y:0,z:0},
    {x:-2.45,y:-0.2,z:0},
    {x:-2.45,y:-0.2,z:0.6},
];
export function getConfigurationSpecials() {
    return {
        stars: stars,
        mountains: mountains
    }
}