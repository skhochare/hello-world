// Object: It is a collection of Key-Value pairs, where key can be number, string, and value can be any valid JS.
var cap = {
    name: "Steve",
    "last Name": "Rogers",
    isAvenger: true,
    address: {
        city: "Manhattan",
        state: "New York"
    },
    sayHi: function() {
        console.log("Cap say's HI");
    },
    movies: ["Avenger", "Captain America: Winter Soldier"]
}

// console.log(cap.sayHi());

// ----------------
var cap = {
    name: "Steve",
    age: 34,
    isAvenger: true
};

for (let key in cap) {
    console.log(key, " ", cap[key]); // value = cap[key]
}