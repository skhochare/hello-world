// let a = 10;
// function fn() {
//     console.log("I am fn");

//     function inner() {
//         console.log("I am inner");
//     }

//     inner();
// }

// fn();

// -----------------

function real() {
    console.log("I am real. Always run me");
}
function real(a) {
    console.log("No I am real one ");
}
real();
function real(b) {
    console.log("You both are wasted");
}

// Guess the output:
// [ ] "No I am real one"
// [x] "You both are wasted"
// [ ] Error
