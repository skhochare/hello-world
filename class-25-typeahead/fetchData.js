async function getCountries(keyword) {
    try {
        // HTTP Request
        const rawResponse = await fetch(`https://restcountries.com/v3.1/name/${keyword}`);
        const response = await rawResponse.json();
        
        if (rawResponse.status === 404) {
            console.log("Not entries found for the searched keyword.");
            return [];
        }

        console.log("Data Found!");
        return response;
    } catch(e) {
        console.log("Error:", e);
    }
}

export default getCountries;