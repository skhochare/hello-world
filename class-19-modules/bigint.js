const largeNumber = 12345678901234567890890n;
const fromString = BigInt("987654321098765432103210");

const product = largeNumber * fromString;
console.log("Product: ", product);
