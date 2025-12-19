const fs = require("fs");
const promise = fs.promises.readFile("./f1.txt");

// promise.then(function(data) {
//     console.log("Hi, the data is: " + data);
// });

// promise.then(function(data) {
//     console.log("Buffer format is: ", data);
// });

// promise.then(function() {
//     console.log("I am not accepting");
// });

// promise.catch(function(err) {
//     console.log("err is 1:", err);
// });

// promise.catch(function(err) {
//     console.log("err is 2:", err);
// });

// promise.catch(function() {
//     console.log("I am not accepting");
// });

// promise.finally(function(err) {
//     console.log("err is 1", err);
// })

// promise.finally(function(err) {
//     console.log("err is 2", err);
// })

// promise.finally(function(err) {
//     console.log("I am not accepting");
//     console.log("Second line of finally");
// })

// -----------------------------------

// Promise.resolve("Initial Data").then((data) => {
//     console.log("1st then:", data);
//     return Promise.reject("Rejected from first then");
// }).catch((err) => {
//     console.log("1st catch:", err);
// })

// Promise.resolve("Initial data")
//     .catch((err) => {
//         console.log("1st catch:", err);
//     }).then((data) => {
//         console.log("2nd then:", data);
//         return fs.promises.readFile("./f12341234.txt");
//     }).catch((err) => {
//         console.log("2nd catch:", err.message);
//     })

// FINALLY
Promise.resolve("Initial Data").finally(() => {
    console.log("Finally block executed!");
    return 100
}).then((data) => {
    console.log("DATA: ", data);
})