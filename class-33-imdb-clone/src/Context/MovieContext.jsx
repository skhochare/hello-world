import storage from "../utils/storage";
import { WATCHLIST_LS_KEY } from "../constants";
import { useState, createContext } from "react";

export const MovieContext = createContext();

export default function MovieContextWrapper({ children }) {
    const [watchlist, setWatchlist] = useState(storage.get(WATCHLIST_LS_KEY) || []);

    const addToWatchlist = (movieObj) => {
        const updatedWatchList = [...watchlist, movieObj];
        setWatchlist(updatedWatchList);
        storage.set(WATCHLIST_LS_KEY, updatedWatchList);
    }

    const removeFromWatchlist = (movieObj) => {
        let updatedWatchList = watchlist.filter(movie => movie.id !== movieObj.id);
        setWatchlist(updatedWatchList);
        storage.set(WATCHLIST_LS_KEY, updatedWatchList);
    }

    return <MovieContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, setWatchlist }}>{children}</MovieContext.Provider>
}