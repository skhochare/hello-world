import React, { useEffect, useState } from "react";
import { Button, Table, message, Popconfirm, Tooltip } from "antd";
import { getAllMovies, deleteMovie } from "../../api/movies";
import MovieForm from "./MovieForm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  const onMovieFormSuccess = () => {
    fetchMovies();
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      const response = await deleteMovie({ movieId: record._id });

      if (response.success) {
        message.success(response.message);
        fetchMovies();
      } else {
        message.error(response.message);
      }
    } catch(err) {
      message.error(err.message);
    } finally {
      setLoading(false);
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
    {
      title: "Actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedMovie(record);
                setOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this movie?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title="Delete">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button type="primary" onClick={() => {
          setSelectedMovie(null);
          setOpen(!open)
        }}>Add Movie</Button>
      </div>

      <Table
        dataSource={movies}
        columns={tableColumns}
        rowKey="_id"
        loading={loading}
      />

      <MovieForm
        open={open}
        setOpen={setOpen}
        selectedMovie={selectedMovie}
        setSelectedMovie={setSelectedMovie}
        onSuccess={onMovieFormSuccess}
      />
    </div>
  );
}

export default MovieList;