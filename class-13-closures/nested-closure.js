let foo = 200;
function getFirstName(firstName) {
    console.log("I have got your firstName");
    return function getLastName(lastName) {
        return function greeter() {
            console.log(`Hi I am ${firstName} ${lastName}`);
            console.log("Number: ", foo);
        }
    }
}

const fnNameRtrn = getFirstName("Scaler");
const lnNameRtrn = fnNameRtrn("Academy");

lnNameRtrn();