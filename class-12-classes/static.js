// SYNTAX
// class ClassName {
//     // Static property
//     static propertyName = value;

//     // Static Method
//     static methodName() {
//         // Method Body
//     }
// }


class MathUtils {
    // Static property
    static PI = 3.14159;

    // Static Method
    static square(x) {
        return x * x;
    }

    static cube(x) {
        return x * x * x;
    }

    // Instance method (for comparison)
    calculateArea(radius) {
        // Can access static properties using the className
        return MathUtils.PI * MathUtils.square(radius);
    }
}

// Using static methods and property
console.log(MathUtils.PI);
console.log(MathUtils.square(5));
console.log(MathUtils.cube(2));

// Instance methods needs an instance
const utils = new MathUtils();
console.log(utils.calculateArea(2));
