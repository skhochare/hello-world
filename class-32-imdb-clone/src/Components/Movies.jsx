import React, {useState} from 'react'

function Movies() {
    const [movies, setMovies] = useState([
        {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 1"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 2"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 3"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 4"},
         {url:"https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", title:"Movie 5"},
     ]);
     const [pageNo, setPageNo] = useState(1);
     const handlePrev = () => {
        if(pageNo!=1) setPageNo(pageNo-1);
     }

     const handleNext = () => {
        setPageNo(pageNo+1);
     }
  return (
    <div>
        {/* title */}
        <div className='text-2xl font-bold text-center m-5'>
            <h1>Trending Movies</h1>
        </div>

        {/* all movies */}
        <div className='flex justify-evenly flex-wrap gap-8'>
            {movies.map((movieObj) =>{
                return (
                <div className="h-[40vh] w-[200px] bg-center bg-cover rounded-xl hover:scale-110 duration-300 hover:cursor-pointer" style={{backgroundImage:`url(${movieObj.url})`}}>
                    <div className='text-white w-full text-center text-xl bg-gray-900/70 rounded-xl p-2'>{movieObj.title}</div>
                </div>)
            })}
        </div>

        {/* pagination */}
        <div className='bg-gray-400 h-[50px] w-full mt-8 flex justify-center gap-3 p-4'>
            {/* dont show if pageNo is 0  */}
            <div onClick={handlePrev}><i class="fa-solid fa-left-long"></i></div>
            <div>{pageNo}</div>
            <div onClick={handleNext}><i class="fa-solid fa-right-long"></i></div>
        </div>
    </div>
  )
}

export default Movies