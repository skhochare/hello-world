// Pre-ES6 Constructor function
// function Person(name) {
//     this.name = name;
// }

// // Adding a method to the prototype
// Person.prototype.getName = function() {
//     return this.name;
// }

// // Creating an instance
// var p = new Person("John Doe");
// console.log(p.getName());

// ---------------------------------------------

// ES6 Class
class Person {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

var p = new Person("John Doe");
console.log(p.getName());