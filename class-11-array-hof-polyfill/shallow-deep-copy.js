let object = {
    a: 20
};

let clonedObject = { ...object }; // This is a copy

object.a = 30;

// console.log("object.a:", object.a); // ??
// console.log("clonedObject.a:", clonedObject.a); // ?? 

// ----------
let arr = [1, 2, 3, 4, [10, 12], 5, 6];

// let clonedArr = [...arr];
let clonedArr = structuredClone(arr);

clonedArr[2] = 100;
clonedArr[3] = 200;
clonedArr[4][1] = 300;

console.log("old:", arr); // ??
console.log("new:", clonedArr); // ??

// ------------------------

let person = {
    firstName: "John",
    lastName: "Doe",
    address: {
        street: "North 1st street",
        city: "San Jose",
        state: "CA",
        country: "USA"
    }
}

// Shallow Copy
// let shallowObj = Object.assign({}, person);
// shallowObj.lastName = "Odison";
// shallowObj.address.street = "South 1st street";

// Deep Copy
// let deepObj = JSON.parse(JSON.stringify(person));
// deepObj.lastName = "Odison";
// deepObj.address.street = "South 1st street";

// console.log("person:", person);
// console.log("shallowObj:", shallowObj);
// console.log("deepObj:", deepObj);