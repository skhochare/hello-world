// SYNTAX
// class ChildClass extends ParentClass {
//     // Class Body
// }

// Parent Class
class Vehicle {
    constructor(make, model) {
        this.make = make;
        this.model = model;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        return `${this.make} ${this.model} started`;
    }

    stop() {
        this.isRunning = false;
        return `${this.make} ${this.model} stopped`;
    }

    getInfo() {
        return `${this.make} ${this.model}`;
    }
}

// Child Class
class Car extends Vehicle {
    constructor(make, model, numDoors) {
        // Call the parent constructor with super()
        super(make, model);
        this.numDoors = numDoors;
    }

    // Override
    getInfo() {
        return `${super.getInfo()}, ${this.numDoors} doors`;
    }

    // Add a new method
    honk() {
        return "Beep Beep!";
    }
}

const myCar = new Car("Toyota", "Corolla", 4);
// console.log(myCar.start());
// console.log(myCar.getInfo());
// console.log(myCar.honk());

class ElectricCar extends Car {
    constructor(make, model, numDoors, batteryCapacity) {
        super(make, model, numDoors);
        this.batteryCapacity = batteryCapacity;
    }

    getInfo() {
        return `${super.getInfo()}, ${this.batteryCapacity} kWh battery`;
    }
}

const myTesla = new ElectricCar("Tesla", "Model 3", 4, 75);
console.log(myTesla.getInfo());