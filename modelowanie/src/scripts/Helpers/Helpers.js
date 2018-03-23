export function factorial(n) {
    if ((n === 0) || (n === 1))
       return 1
    else {
       let result = (n * factorial(n-1) );
       return result
    }
 }