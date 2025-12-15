const fs = require("fs");
// Synchronous function provided by the nodejs to read a file

// console.log("Before");
// const buffer = fs.readFileSync("./f1.txt");
// console.log("" + buffer);
// console.log("After");


// Asynchronous function provided by the nodejs to read a file

// console.log("Before");
// fs.readFile("./f1.txt", function(err, data) {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log("" + data);
// });
// console.log("After");


// 2 sync function calls

// console.log("Before");
// const buffer1 = fs.readFileSync("./f1.txt");
// const buffer2 = fs.readFileSync("./f2.txt");
// console.log("" + buffer1);
// console.log("" + buffer2);
// console.log("After");

// ------------------------------------------------------------------------

console.log("Before");
fs.readFile("./f1.txt", function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("" + data);
});

fs.readFile("./f2.txt", function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("" + data);
});
console.log("After");