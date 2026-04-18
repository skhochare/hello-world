import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { getAllMovies } from "../../api/movies";
import { addShow, getShowsByTheatre } from "../../api/shows";

export default function TheatreShows() {
    const { theatreId } = useParams();
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const showsRes = await getShowsByTheatre(theatreId);
            if (showsRes.success) setShows(showsRes.data);

            const moviesRes = await getAllMovies();
            if (moviesRes.success) setMovies(moviesRes.data);
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onFinish = async (values) => {
        try {
            const payload = {
                theatre: theatreId,
                movie: values.movie,
                date: values.date,
                time: values.time,
                ticketPrice: Number(values.ticketPrice),
            };

            const res = await addShow(payload);

            if (res.success) {
                message.success(res.message);
                setIsModalOpen(false);
                form.resetFields();
                fetchData();
            } else {
                message.error(res.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div>
            <header className="App-header_base">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h2 style={{ marginBottom: 0 }}>Shows</h2>

                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Add Show
                    </Button>
                </div>

                <div style={{ marginTop: 16 }}>
                    {shows.length === 0 ? (
                        <p>No shows added yet.</p>
                    ) : (
                        <div style={{ display: "grid", gap: 12 }}>
                            {shows.map((show) => (
                                <div
                                    key={show._id}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 8,
                                        padding: 12,
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>
                                        {show.movie?.title || "Movie"}
                                    </div>
                                    <div>Date: {show.date}</div>
                                    <div>Time: {show.time}</div>
                                    <div>Ticket Price: ₹{show.ticketPrice}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Modal
                    title="Add Show"
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Movie"
                            name="movie"
                            rules={[{ required: true, message: "Please select a movie" }]}
                        >
                            <Select
                                placeholder="Select a movie"
                                options={movies.map((m) => ({
                                    label: m.title,
                                    value: m._id,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Date (YYYY-MM-DD)"
                            name="date"
                            rules={[{ required: true, message: "Please enter show date" }]}
                        >
                            <Input placeholder="2026-02-24" />
                        </Form.Item>

                        <Form.Item
                            label="Time (HH:mm)"
                            name="time"
                            rules={[{ required: true, message: "Please enter show time" }]}
                        >
                            <Input placeholder="18:30" />
                        </Form.Item>

                        <Form.Item
                            label="Ticket Price"
                            name="ticketPrice"
                            rules={[{ required: true, message: "Please enter ticket price" }]}
                        >
                            <Input placeholder="250" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            Save Show
                        </Button>
                    </Form>
                </Modal>

            </header>
        </div>
    );
}