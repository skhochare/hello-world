import getCountries from "./fetchData.js";

const inputBox = document.getElementById("search_input");
const suggestionBox = document.getElementById("suggestion_box");

function debounce(fn, delay = 1000) {
    let timerId;
    return function(...args) {
        if (timerId) {
            console.log("I am reseting you now wait again from the start");
            clearTimeout(timerId);
        }

        // User wants to call the fn after a delay
        timerId = setTimeout(function() {
            fn(...args);
        }, delay);
    }
}

const populateSuggestionBox = (countryNameArr) => {
    if (!countryNameArr.length) {
        suggestionBox.classList.remove("visible");
        return;
    }
    suggestionBox.classList.add("visible");

    // Before showing any result -> reset our suggestion box
    suggestionBox.innerHTML = "";

    const fragment = document.createDocumentFragment();
    // Add all the list to that fragment
    countryNameArr.forEach(countryName => {
        const li = document.createElement("li");
        li.innerText = countryName;
        fragment.appendChild(li);
    });

    suggestionBox.appendChild(fragment);
};

const handleSearch = async (keyword) => {
    const countriesArr = await getCountries(keyword);
    const countryNameArr = countriesArr.map((country) => country.name.common);
    return countryNameArr;
}

const handleSuggestions = async (e) => {
    const keyword = e.target.value;
    const countryNameArr = await handleSearch(keyword);
    populateSuggestionBox(countryNameArr);
};

inputBox.addEventListener("input", debounce(handleSuggestions));