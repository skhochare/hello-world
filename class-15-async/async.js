/**
 * Synchronous code -> The code that executes line by line
 */

// console.log("before");

// function fn() {
//     console.log("I am fn!");
// }

// fn();

// console.log("After");

// -----------------------------------------------------------

/**
 * Asynchronous Code -> Piece of code that's executed at the current point of time
 * and other piece of code is executed on later part.
 */

// console.log("Before");

// function fn() {
//     console.log("I am fn");
// }

// setTimeout(fn, 2000);

// console.log("After");

// ------------------------------------------------------------------

// let a = true;

// console.log("Before");

// setTimeout(() => {
//     a = false;
//     console.log("I broke the while loop");
// }, 1000);

// console.log("After");

// while(a) {}

// ----------------------------------------------------------------------

// console.log("Before");

// const cb2 = () => {
//     console.log("Set Timeout 1");
//     while (1) {}
// };

// const cb1 = () => {
//     console.log("Hello");
// };

// setTimeout(cb2, 1000);
// setTimeout(cb1, 2000);

// console.log("After");

// -----------------------------------------------------------------------

console.log("Before");

const cb2 = () => {
    console.log("Set Timeout 1");
    let timeInFuture = Date.now() + 5000;
    while(Date.now() < timeInFuture) {}
};

const cb1 = () => console.log("Hello");

setTimeout(cb2, 1000);
setTimeout(cb1, 2000);

console.log("After");
