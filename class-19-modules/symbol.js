const str1 = "hello";
const str2 = "hello";

console.log(str1 === str2); // true

const array1 = [1,2,3];
const array2 = [1,2,3];

console.log(array1 === array2); // false

// -----------------------------------
const symbol1 = Symbol("description");
const symbol2 = Symbol("description");

// Using Symbols as Object Properties
const person = {
    name: "Learner",
    age: 30,
    [symbol1]: "A person"
};

console.log(person[symbol1]);
console.log(person[symbol2]);

// Checking Symbol Description
console.log(symbol1.toString());
console.log(symbol2.description);