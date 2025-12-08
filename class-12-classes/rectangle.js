class Rectangle {
    // Public class fields
    name = "Unknown";
    price = 0;
    h = 10;

    constructor(height = h, width) {
        this.width = width;
        this.height = height;
        this.randomProperty = price;
    }

    // Instance Method
    calculateArea() {
        return this.width * this.height;
    }

    // Instance method with parameter
    scale(factor) {
        this.width *= factor;
        this.height *= factor;
        return this;
    }
}

const rect = new Rectangle(5, 10);
console.log(rect.calculateArea()); // 50
rect.scale(2);
console.log(rect.calculateArea()); // 200