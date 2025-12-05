let superClone = (original) => {
    let isArr = Array.isArray(original);
    let copy = isArr ? [] : {};

    for (let prop in original) {
        if (Array.isArray(original[prop])) {
            copy[prop] = [...original[prop]];
            for (let i = 0; i < copy[prop].length; i++) {
                if (copy[prop][i] == "object") {
                    copy[prop][i] = superClone(original[prop][i]);
                }
            }
        } else if (typeof original[prop] === "object") {
            copy[prop] = superClone(original[prop]);
        } else {
            copy[prop] = original[prop];
        }
    }

    return copy;
};

// let person = {
//     firstName: "John",
//     lastName: "Doe",
//     address: {
//         street: "North 1st street",
//         city: "San Jose",
//         state: "CA",
//         country: "USA"
//     }
// }

// Deep Copy
// let deepObj = superClone(person);
// deepObj.lastName = "Odison";
// deepObj.address.street = "South 1st street";

// console.log("person:", person);
// console.log("deepObj:", deepObj);

let arr = [1, 2, 3, 4, [10, 12], 5, 6];
let clonedArr = superClone(arr);

clonedArr[2] = 100;
clonedArr[3] = 200;
clonedArr[4][1] = 300;

console.log("old:", arr); // ??
console.log("new:", clonedArr); // ??