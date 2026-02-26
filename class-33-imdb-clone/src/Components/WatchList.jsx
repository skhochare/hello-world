import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { MovieContext } from '../Context/MovieContext';

import { WATCHLIST_LS_KEY } from "../constants"
import storage from "../utils/storage"

function WatchList() {
  const [watchlist, setWatchlist] = useState(storage.get(WATCHLIST_LS_KEY) || [])
  const [genre, setGenre] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { removeFromWatchlist } = useContext(MovieContext);

  useEffect(() => {
    function fetchGenre() {
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/genre/movie/list`,
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzQ5ZWU4NjkyN2M4NjJlNmFjNDAzNjBlM2ViOGMwZCIsIm5iZiI6MTY1NzgxODcwMy4yMDIsInN1YiI6IjYyZDA0ZTRmMzk0YTg3MDRhZTVjNWEzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._LNDpBJ--YTga2vupX46hCWhBnsgEW43JjSJ2hyTA6k",
        },
      };
      axios
        .request(options)
        .then((res) => {
          const genres = res.data?.genres;
          const computeGenreMap = genres.reduce((acc, genreObj) => {
            const { id, name } = genreObj;
            return { ...acc, [id]: name };
          }, {});
          setGenre(computeGenreMap);
        })
        .catch((err) => console.error(err));
    }
    fetchGenre();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredList = watchlist.filter(({ title }) => {
        return title.toLowerCase().includes(searchQuery.toLowerCase())
      });
      setWatchlist(filteredList);
    } else {
      setWatchlist(storage.get(WATCHLIST_LS_KEY) || []);
    }
  }, [searchQuery]);

  const handleAscendingRatings = () => {
    let sortedAscending = watchlist.sort((movieObjA, movieObjB) => {
      return movieObjA.vote_average - movieObjB.vote_average;
    });

    setWatchlist([...sortedAscending]);
  };

  const handleDecendingRatings = () => {
    let sortedDecending = watchlist.sort((movieObjA, movieObjB) => {
      return movieObjB.vote_average - movieObjA.vote_average;
    });

    setWatchlist([...sortedDecending]);
  };

  if (watchlist.length === 0) {
    return <h2>
      No movie has been added to watchlist. yet.
    </h2>
  }
  return (
    <div>
      <div className="flex justify-start">
        <input
          className="border-2 px-2 py-1 mb-2"
          placeholder="Search Watchlist"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="bg-neutral-secondary-soft border-b border-default">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Movie Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium flex gap-2">
                <div className='cursor-pointer' onClick={handleAscendingRatings}><i className="fa-solid fa-arrow-up"></i></div>
                Rating
                <div className='cursor-pointer' onClick={handleDecendingRatings}><i className="fa-solid fa-arrow-down"></i></div>
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Popularity
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Genre
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((movie => {
              const { title, vote_average, popularity, genre_ids } = movie;
              return (
                <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                  <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {title}
                  </th>
                  <td className="px-6 py-4">
                    {vote_average}
                  </td>
                  <td className="px-6 py-4">
                    {popularity}
                  </td>
                  <td className="px-6 py-4">
                    {genre[genre_ids[0]]}
                  </td>
                  <td className="px-6 py-4" onClick={() => removeFromWatchlist(movie)}>
                    <a href="#" className="font-medium text-fg-brand hover:underline">Delete</a>
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WatchList
