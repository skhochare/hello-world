// Currying: It involves splitting up a function that accepts multiple arguments into
// several functions that only accept one parameter each.

function getFirstName(firstName) {
    console.log("I have got your firstName");
    return function getLastName(lastName) {
        return function greeter() {
            console.log(`Hi I am ${firstName} ${lastName}`);
        }
    }
}

// getFirstName("Scaler")("Academy")();

// const getLastName = getFirstName("Scaler");
// const greeter = getLastName("Academy");
// greeter();

// ---------------------------------------------

// let a = 100;
// console.log("Before");
// function cb() {
//     console.log("I will explode", a);
// }
// setTimeout(cb, 2000);
// console.log("After");

// ---------------------------------------------

function outer() {
    let arrFn = [];
    for (let i = 0; i < 3; i++) {
        arrFn.push(function fn() {
            console.log(i);
        })
    }
    return arrFn;
}

let arrFn = outer();
arrFn[0](); // 0
arrFn[1](); // 1
arrFn[2](); // 2