// COPYING PRIMITIVE VALUES

let a = 15;
let b = a; // This is a copy

a = 20;

// console.log("a:", a); // 20
// console.log("b:", b); // 15

// --------------------------------------------------

// COPYING NON-PRIMITIVE VALUES

let object = {
    a: 20
};

let clonedObject = object; // This is a copy

object.a = 30;

console.log(object.a); // ??
console.log(clonedObject.a); // ?? 