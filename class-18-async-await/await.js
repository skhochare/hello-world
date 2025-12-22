// function value1() {
//     return new Promise((resolve) => {
//         setTimeout(resolve, 2000, "Scaler Academy");
//     })
// }

// async function fetchValue() {
//     const response = await value1();
//     console.log(response, "9");
//     return response;
// }

// const value = await fetchValue();
// console.log(value);

// ------------------------------------------------
function resolveAfter2Seconds() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Resolved!");
        }, 2000);
    })
}

async function asyncCall() {
    console.log("Calling");
    const result = await resolveAfter2Seconds();
    console.log(result);
}

asyncCall();