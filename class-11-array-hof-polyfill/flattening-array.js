let input = [1,2,3,[4,5],[6,7,8,[9,10,11]]];
// output = [1,2,3,4,5,6,7,8,9,10,11]

function flatten(srcArr) {
    let newArr = [];
    for (let i = 0; i < srcArr.length; i++) {
        let elem = srcArr[i];
        let isElemArr = Array.isArray(elem);
        if (isElemArr) {
            // Flatten it again
            let smallFlattenArr = flatten(elem);
            newArr.push(...smallFlattenArr);
        } else {
            // Push it to the newArr
            newArr.push(elem);
        }
    }
    return newArr;
}

// let flattenedArr = flatten(input);
let flattenedArr = input.flat(Infinity);
console.log(flattenedArr);