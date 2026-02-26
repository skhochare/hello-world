import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MovieContext } from "../Context/MovieContext";

function Banner() {
  const [bannerImage, setBannerImage] = useState(
    "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
  );
  const [title, setTitle] = useState("Placeholder Title");
  const API_KEY = "ff85d5a0";//ff85d5a0
  const { watchlist, addToWatchlist, removeFromWatchlist, setWatchlist } = useContext(MovieContext);
  console.log({ watchlist, addToWatchlist, removeFromWatchlist, setWatchlist });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=avengers&page=1`
        );

        const data = await response.json();
        const movie = data?.Search?.[0];
        console.log("Movie Data:", movie.Poster);

        if (movie) {
          setBannerImage(movie.Poster);
          setTitle(movie.Title);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        //className="h-[20vh] md:h-[75vh] bg-cover bg-center flex items-end"
        // style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${bannerImage})` }}
       //className="h-[20vh] md:h-[75vh] bg-contain bg-no-repeat bg-center flex items-end"
       className=" h-[20vh] md:h-[75vh] w-full bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${bannerImage})`}}
      >
        <div className="text-white w-full text-center text-2xl">{title}</div>
      </div>
    </>
  );
}

export default Banner;
