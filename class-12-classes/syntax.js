// // Class Declaration
// class Rectangle {
//     constructor(height, width) {
//         this.height = height;
//         this.width = width;
//     }
// }

// // Class Expression
// const Rectangle = class {
//     constructor(height, width) {
//         this.height = height;
//         this.width = width;
//     }
// };

// // Named Class Expression
// const Rectangle = class Rectangle {
//     constructor(height, width) {
//         this.height = height;
//         this.width = width;
//     }
// };

// --------------------------------
class Student {
    // Class field
    grade = "A";

    // Constructor
    constructor(firstName = "John", lastName = "Doe") {
        this.firstName = firstName;
        this.lastName = lastName;
        this.schoolName = "Scaler";
    }

    // Method
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    // Static Method
    static fromObject(obj) {
        return new Student(obj.firstName, obj.lastName);
    }
}

// Creating an instance
const s = new Student();
console.log(s.getFullName());
// console.log(s.fromObject({firstName: "Johnny", lastName: "Doey"}));