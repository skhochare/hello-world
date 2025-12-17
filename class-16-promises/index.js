const fs = require("fs");

// console.log("Before");

// fs.readFile("./f1.txt", function (err, data) {
//     if (err) {
//         console.log("error: ", err);
//         return;
//     }
//     console.log("Content: " + data);
//     fs.readFile("./f2.txt", function (err, data) {
//         if (err) {
//             console.log("error: ", err);
//             return;
//         }
//         console.log("Content: " + data);
//         fs.readFile("./f3.txt", function (err, data) {
//             if (err) {
//                 console.log("error: ", err);
//                 return;
//             }
//             console.log("Content: " + data);
//         });
//     });
// });

// console.log("After");

// -------------------------

console.log("Before");

fs.readFile("./f1.txt", f1cb);

function f1cb(err, data) {
    if (err) {
        console.log("Error", err);
        return;
    }
    console.log("Content" + data);
    fs.readFile("./f2.txt", f2cb);
}

function f2cb(err, data) {
    if (err) {
        console.log("Error", err);
        return;
    }
    console.log("Content" + data);
    fs.readFile("./f3.txt", f3cb);
}

function f3cb(err, data) {
    if (err) {
        console.log("Error", err);
        return;
    }
    console.log("Content" + data);
}

console.log("After");