import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/imdbLogo.png";
function Navbar() {
  return (
    <div className="flex space-x-8 item-center pl-3 py-4">
      <Link to="/">
        <img className="w-[50px]" src={Logo}></img>
      </Link>

      <Link to="/" className="text-blue-500 text-3xl font-bold">
        Movies
      </Link>

      <Link to="/watchlist" className="text-blue-500 text-3xl font-bold">
        WatchList
      </Link>
    </div>
  );
}

export default Navbar;
