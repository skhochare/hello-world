let fruits = "apple";
console.log(fruits);
{
    // console.log(fruits);
    let fruits; 
    console.log(fruits); 
    fruits = "orange";
    {
        console.log(fruits);
    }
    console.log(fruits);
}
console.log(fruits); 
