function calc(n) {
    let sum = 0;
    for (let i = 0; i < n; i ++) {
        sum += n;
    }
    return sum;
}

function memoize(fn) {
    let cache = {};
    return function(n) {
        // cache -> res -> present
        let isTheInputPresent = cache[n] == undefined;
        if (isTheInputPresent) {
            return cache[n];
        } else {
            const result = fn(n);
            cache[n] = result;
            return result;
        }
        // It is not -> call the actual fn
        // add the result to the cache
        // then return the result
    }
}

const memoizedSum = memoize(calc);
console.time()
memoizedSum(17)
console.timeEnd();
console.time();
memoizedSum(17);
console.timeEnd();