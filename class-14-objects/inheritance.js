// Parent Class
class Candidate {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`Hello World, I am ${this.name}`);
    }
}

// Inheriting parent class
class User extends Candidate {
    constructor(name) {
        super(name);
    } 
}

let c1 = new User("Mithun");
c1.greet();

// --------------------------------------------------------
function Scaler(property) {
    this.property = property;
}

let obj = new Scaler("Academy");
console.log(obj);