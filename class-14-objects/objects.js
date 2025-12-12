// Object Literal

const candidate = {
    firstName: "Mithun",
    class: 12,
    greet: function() {
        console.log("Good Morning. I am Mithun");
    }
};

// console.log(candidate.firstName);
// console.log(candidate.class);
// candidate.greet(); // Output

// ------------------------------------------------------------

// let a = "Hello";
// console.log("Type of A:", typeof a);

// let b = new String(a);
// console.log("Type of B:", typeof b, b);

// let c = b.valueOf()
// console.log("Type of C:", typeof c);

// ------------------------------------------------------------
// OBJECT.CREATE()

// Creating the prototype for the object that will be created later
function greeting() {
    this.greeting = "Hello Mithun!";
}

// using the object.create() method to create a function whose object inherits
// properties from the prototype
function greetMithun() {
    greeting.call(this);
}

// creating an greetMithun function object with the prototype object's
// properties (such as greeting)
greetMithun.prototype = Object.create(greeting.prototype);
const app = new greetMithun();

// Displaying the object created
// console.log(app.greeting); // Output: Hello Mithun!

// ------------------------------------------------------------
// Defining the prototype
const carPrototype = {
    // A shared value
    wheels: 4,

    // A shared method
    start() {
        console.log("The car engine is starting");
    }
};

const myCar = Object.create(carPrototype);
// console.log(myCar);

// ------------------------------------------------------------
// Creating an object from another object

let c = {
    name: "Mithun",
    age: 24,
    job: "developer"
}

let pickNameAndAge = function(record) {
    return {
        name: record.name,
        age: record.age
    }
}

const obj = pickNameAndAge(c);
// console.log(obj);

// How do we itirate an object
const student = {
    firstName: "Mithun",
    lastName: "Singh"
}

// for ... in
for (attribute in student) {
    console.log(`Key: ${attribute}, Value: ${student[attribute]}`);
}

// ---------------------------------------------------------------
// Object.keys()

console.log(Object.keys(student)); // Return array of keys
console.log(Object.values(student)); // Return array of values