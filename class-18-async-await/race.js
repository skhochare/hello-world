const firstPromise = new Promise((res, rej) => {
    setTimeout(() => res('First Promise Won!'), 2000);
});

const secondPromise = new Promise((res, rej) => {
    setTimeout(() => rej('Second Promise Won!'), 1500);
})

Promise.race([firstPromise, secondPromise]).then((result) => {
    console.log("result: ", result);
}).catch((err) => {
    console.log("Err: ", err);
});