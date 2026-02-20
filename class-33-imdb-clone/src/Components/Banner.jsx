import React, { useEffect, useState } from "react";
import axios from "axios";

function Banner() {
  const [bannerImage, setBannerImage] = useState(
    "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
  );
  const [title, setTitle] = useState("Placeholder Title");

  useEffect(() => {
    function fetchData(){
      const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzQ5ZWU4NjkyN2M4NjJlNmFjNDAzNjBlM2ViOGMwZCIsIm5iZiI6MTY1NzgxODcwMy4yMDIsInN1YiI6IjYyZDA0ZTRmMzk0YTg3MDRhZTVjNWEzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._LNDpBJ--YTga2vupX46hCWhBnsgEW43JjSJ2hyTA6k",
      },
    };
    axios
      .request(options)
      .then((res) => {
        console.log(res.data);
        const movie = res.data?.results[0];
        setBannerImage(movie["backdrop_path"]);
        setTitle(movie["title"]);
      })
      .catch((err) => console.error(err));
    }
    fetchData();
  }, []);

  return (
    <>
      <div
        className="h-[20vh] md:h-[75vh] bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${bannerImage})` }}
      >
        <div className="text-white w-full text-center text-2xl">{title}</div>
      </div>
    </>
  );
}

export default Banner;
