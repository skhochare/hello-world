import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import { getShowsByMovie } from "../api/shows.js";


export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();


  const getTodayYYYYMMDD = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };


  const [shows, setShows] = useState([]);
  const [date, setDate] = useState(getTodayYYYYMMDD());


  const fetchShows = async (selectedDate) => {
    try {
      const res = await getShowsByMovie(movieId, selectedDate);
      if (res.success) {
        setShows(res.data);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };


  // Auto fetch on first load
  useEffect(() => {
    fetchShows(date);
  }, [movieId]);


  // Refetch when date changes
  useEffect(() => {
    fetchShows(date);
  }, [date]);


  // Group shows by theatre
  const groupedByTheatre = useMemo(() => {
    const map = {};
    for (const show of shows) {
      const theatreId = show.theatre?._id;
      if (!theatreId) continue;


      if (!map[theatreId]) {
        map[theatreId] = {
          theatre: show.theatre,
          shows: [],
        };
      }
      map[theatreId].shows.push(show);
    }


    return Object.values(map);
  }, [shows]);


  return (
    <div>
      <header className="App-header_base">
        <h2 style={{ marginBottom: 12 }}>Select Date</h2>


        <div style={{ marginBottom: 24 }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />
        </div>


        {groupedByTheatre.length === 0 ? (
          <p>No shows found for this movie on this date.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {groupedByTheatre.map((group) => (
              <div
                key={group.theatre._id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {group.theatre.name}
                </div>
                <div style={{ opacity: 0.85 }}>{group.theatre.address}</div>


                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {group.shows.map((show) => (
                    <Button
                      key={show._id}
                      onClick={() => navigate(`/book-show/${show._id}`)}
                    >
                      {show.time}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}
