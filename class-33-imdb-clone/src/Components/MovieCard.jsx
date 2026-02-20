import React from "react";

function MovieCard({ movieObj, addToWatchlist }) {
  return (
    <div
      className="h-[40vh] w-[200px] bg-center bg-cover rounded-xl hover:scale-110 duration-300 hover:cursor-pointer"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movieObj["poster_path"]})`,
      }}
    >
      <div className="text-white w-full text-center text-xl bg-gray-900/70 rounded-xl p-2">
        {movieObj.title}
      </div>

      <div onClick={()=> addToWatchlist(movieObj)}className="flex items-center m-4 h-8 w-8 bg-gray-900/60">😍</div>
    </div>
  );
}

export default MovieCard;
