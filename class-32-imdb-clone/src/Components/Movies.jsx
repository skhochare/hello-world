import React, {useState} from 'react'

function Movies() {
    const [movies, setMovies] = useState([
        {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 1"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 2"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 3"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 4"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 5vhbejbcjhecefrfcewrf rferferf"},
     ]);
  return (
    <div>
        <div className='text-2xl font-bold text-center m-5'>
            <h1>Trending Movies</h1>
        </div>
        <div className='flex justify-evenly flex-wrap gap-8'>
            {movies.map((movieObj) =>{
                return (
                <div className="h-[40vh] w-[200px] bg-center bg-cover rounded-xl hover:scale-110 duration-300 hover:cursor-pointer" style={{backgroundImage:`url(${movieObj.url})`}}>
                    <div className='text-white w-full text-center text-xl bg-gray-900/70 rounded-xl p-2'>{movieObj.title}</div>
                </div>)
            })}
        </div>
    </div>
  )
}

export default Movies