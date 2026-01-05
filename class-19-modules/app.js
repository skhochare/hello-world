// Import Named Exports
import { greet, PI } from "./utils.js";

console.log(greet("Scaler"));
console.log(`Value of PI: ${PI}`);

// Import Default Exports
import scalerMultiply from "./utils.js";

console.log(scalerMultiply(2, 3));