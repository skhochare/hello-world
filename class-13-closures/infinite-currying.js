function counter(args) {
    // write code only inside this function
    let count = 0;
    count++;
    if (args == 0) {
        return count;
    } else {
        return function inner(args) {
            count++;
            if (args == 0) {
                return count;
            } else {
                return inner;
            }
        }
    }
}
console.log(counter(0)); // Output :  1
console.log(counter()(0)); // Output : 2
console.log(counter()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()(0)); // Output : 2