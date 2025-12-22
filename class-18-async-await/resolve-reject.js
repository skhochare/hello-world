const p = Promise.resolve("Resolved value");

p.then(function(value) {
    console.log("Resolved: ", value);
});

const pRej = Promise.reject("Reject error message");

pRej.then(() => {
    console.log("This function will not be executed!");
}).catch((err) => {
    console.log("Caught an error: ", err);
});