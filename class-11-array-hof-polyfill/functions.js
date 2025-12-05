function fn(name, callback) {
    console.log("Hi I am", name);
    callback("FOO");
}

const randomFn = function(value) {
    console.log("TESTING", value);
}

fn("Shashwat", randomFn);