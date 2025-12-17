const fs = require("fs");

console.log("Before");

// const p = fs.promises.readFile("./f1.txt");
// p.then(function (data) {
//     console.log("Content" + data);

//     const p2 = fs.promises.readFile("./f2.txt");
//     p2.then(function (data) {
//         console.log("Content" + data);

//         const p3 = fs.promises.readFile("./f3.txt");
//         p3.then(function (data) {
//             console.log("Content" + data);
//         });
//     });
// });

// Chaining
const p = fs.promises.readFile("./f1.txt");
p.then(function (data) {
    console.log("Content " + data);

    const p2 = fs.promises.readFile("./f28237492837849.txt");
    return p2;
}).then(function (data) {
    console.log("Content " + data);

    const p3 = fs.promises.readFile("./f3.txt");
    return p3;
}).then(function (data) {
    console.log("Content " + data);
}).catch(function (error) {
    console.log("Error", error);
})

console.log("After");