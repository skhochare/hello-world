// function outerFn() {
//     let count = 0;

//     function innerFn() {
//         count++;
//         return count;
//     }

//     return innerFn;
// }

// const innerFunc = outerFn(); // innerFunc will store the reference to innerFn
// console.log(innerFunc()); // 1
// console.log(innerFunc()); // 2

// ----------------------------------------

function createCounter(init, delta) {
    function count() {
        init = init + delta;
        return init;
    }

    return count;
}

let c1 = createCounter(10, 5);
let c2 = createCounter(5, 2);

console.log(c1()); // 15
console.log(c2()); // 7

console.log(c1()); //  20
console.log(c2()); // 9