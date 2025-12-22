const value1 = new Promise((res, rej) => {
    res("Scaler Academy");
})

const value2 = "Scaler Academy";

async function fetchValue() {
    return value1;
}

const result = fetchValue();
console.log(result); // ??