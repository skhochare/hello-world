const obj = {};
Object.defineProperty(obj, "foo", {
    value: "bar",
    writable: false, // Whether the property can be modified or not
    enumerable: false,
    configurable: false, // Whether the property can be deleted or not
})

for(attr in obj) {
    console.log(attr);
}

obj.foo = "baz";
delete obj.foo;

console.log(obj);