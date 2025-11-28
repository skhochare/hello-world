let a = 10;
console.log("line number 2", a); // 10

function fn() {
    let a = 20;
    console.log("line number 4", a); // 20
    a++;
    console.log("line number 7", a); // 21
    if (a) {
        let a = 30;
        a++;
        console.log("line number 11", a); // 31
    }
    console.log("line number 13", a); // 21
}
fn();

console.log("line number 16", a); // 10
