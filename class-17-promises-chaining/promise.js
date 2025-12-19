function promSetTimeout(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("hey then");
        }, delay);
    });
}

// promSetTimeout(1000).then((data) => {
//     console.log(data);
// })

// -------------------------------------------------

const executorFn = (resolve, reject) => {
    setTimeout(() => {
        const value = "Hey then";
        resolve(value);
    }, 1000);
}

const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function CustomPromise(executorFn) {
    let state = PENDING;
    let value = undefined;
    let scbArr = [];
    let fcbArr = [];

    this.then = (cb) => {
        if (state === RESOLVED) {
            cb(value);
        } else {
            scbArr.push(cb);
        }
    }

    this.catch = (cb) => {
        if (state === REJECTED) {
            cb(value);
        } else {
            fcbArr.push(cb);
        }
    }

    const resolve = (val) => {
        state = RESOLVED;
        value = val;
        scbArr.forEach(cb => cb(value));
    }

    const reject = (err) => {
        state = REJECTED;
        value = err;
        fcbArr.forEach(cb => cb(value));
    }

    executorFn(resolve, reject);
}

const myPromise = new CustomPromise(executorFn);

myPromise.then((data) => {
    console.log(data);
})

myPromise.catch((err) => {
    console.log(err);
})