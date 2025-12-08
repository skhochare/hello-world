// SYNTAX
class ClassName {
    // Getter
    get propertyName() {
        // Return the value
    }

    // Setter
    set propertyName(value) {
        // Set the value
    }
}

// ------------------------

class Student {
    constructor(firstName, lastName) {
        this._firstName = firstName;
        this._lastName = lastName;
    }

    // Getter
    get fullName() {
        return `${this._firstName} ${this._lastName}`;
    }

    // Setter for fullName
    set fullName(name) {
        const parts = name.split(" ");
        this._firstName = parts[0] || "";
        this._lastName = parts[1] || "";
    }

    // Getter for firstName
    get firstName() {
        return this._firstName;
    }

    // Setter for firstName
    set firstName(value) {
        if (typeof value !== "string") {
            throw new Error("First name must be a string");
        }
        this._firstName = value;
    }
}

const student = new Student("John", "Doe");
console.log(student.fullName);

student.fullName = "Jane Smith";
console.log(student.firstName);
console.log(student.fullName);

// Using the validation in the setter
try {
    student.firstName = 1234;
} catch (err) {
    console.error(err.message);
}