const storage = {
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch(err) {
            console.error("Error saving to localStorage:", err);
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch(err) {
            console.error("Error reading from the localStorage:", err);
            return defaultValue;
        }
    }
};

export default storage;