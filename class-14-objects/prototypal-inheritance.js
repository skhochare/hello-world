let candidate = {
    fly: true,
    canTalk() {
        return "Sorry, Can't talk";
    }
}

// Object User
let user = {
    CanCook: true,
    CanCode() {
        return "Can't Code"
    },

    // Inheriting the properties and methods of candidate
    __proto__: candidate,
}

console.log(user);