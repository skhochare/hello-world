var varName = 10;

// Fn definition
function b() {
    console.log("in b", varName); // ?? 10
}

function fn() {
    var varName = 20;
    // fn call
    b(); // Will this be executed properly or throw an error? Executed
    console.log(varName); // ?? 20
}

fn();