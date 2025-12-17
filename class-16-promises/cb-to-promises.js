let fs = require("fs");
/**
 * We want our created function to be converted from callback to promise
 */

function promReadFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// ------------ USECASE ------------

// console.log("Before");

// const p = promReadFile("./f1.txt");
// p.then(function (data) {
//     console.log("Data inside the file is " + data);
// })

// p.catch(function (error) {
//     console.log("Error", error);
// })

// console.log("After");

// -------------------------------------------------------

const num = 10;
const p = new Promise(function (res, rej) {
    if (num % 2 === 0) {
        res("Is Even!");
    } else {
        rej("Is Odd!");
    }
});

p.then(function (data) {
    console.log("Number", data);
});

p.catch(function (error) {
    console.log("Number", error);
});