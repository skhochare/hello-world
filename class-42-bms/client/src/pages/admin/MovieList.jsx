import React, { useEffect, useState } from "react";
import { Button, Table, message } from "antd";
import { getAllMovies } from "../../api/movies";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMovies();

      if (response.success) {
        setMovies(response.data);
      } else {
        message.error(response.message);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const tableColumns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, record) => (
        <img src={record.poster} alt="poster" width="70" />
      ),
    },
    {
      title: "Movie Name",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text, record) => `${record.duration} mins`,
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button type="primary">Add Movie</Button>
      </div>

      <Table
        dataSource={movies}
        columns={tableColumns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
}

export default MovieList;