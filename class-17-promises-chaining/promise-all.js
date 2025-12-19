const p0 = Promise.resolve("JUST FOR FUN!");
const p1 = 42;
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("foo");
    }, 1000);
});

// 1. Change from Promise.prototype to Promise (Static method)
Promise.myAll = function (arrayOfPromises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let completedPromises = 0;

        if (arrayOfPromises.length === 0) {
            resolve([]);
            return;
        }

        arrayOfPromises.forEach((promise, index) => {
            // 2. Use Promise.resolve() to handle non-promise values (like p1 = 42)
            Promise.resolve(promise)
                .then((value) => {
                    results[index] = value;
                    completedPromises += 1;

                    // 3. Check if all promises have finished
                    if (completedPromises === arrayOfPromises.length) {
                        resolve(results);
                    }
                })
                .catch((err) => {
                    // 4. Fail-fast: If any promise rejects, the whole thing rejects
                    reject(err);
                });
        });
    });
};

Promise.myAll([p0, p1, p2])
    .then((data) => {
        console.log("DATA: ", data);
    })
    .catch((err) => {
        console.log("Error Message: ", err); // Will log "foo" after 1 second
    });