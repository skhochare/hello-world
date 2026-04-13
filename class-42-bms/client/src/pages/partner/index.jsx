import React, { useEffect, useState } from "react";
import { Button, Table, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { getMyTheatres } from "../../api/theatres";
import TheatreForm from "./TheatreForm";

function Partner() {
    const [open, setOpen] = useState(false);
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTheatres = async () => {
        try {
            setLoading(true);
            const res = await getMyTheatres();

            if (res.success) {
                setTheatres(res.data || []);
            } else {
                message.error(res.message || "Failed to fetch theatres");
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheatres();
    }, []);

    const columns = [
        { title: "Name", dataIndex: "name" },
        { title: "Address", dataIndex: "address", ellipsis: true },
        { title: "Phone", dataIndex: "phone", width: 140 },
        { title: "Email", dataIndex: "email", ellipsis: true },
        {
            title: "Status",
            width: 120,
            render: (_, record) =>
                record.isActive ? (
                    <Tag color="green">Approved</Tag>
                ) : (
                    <Tag color="orange">Pending</Tag>
                ),
        },
    ];

    return (
        <div>
            <header className="App-header_base">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <h2 style={{ margin: 0 }}>Partner Theatres</h2>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                        Add Theatre
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={theatres}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                />

                <TheatreForm
                    open={open}
                    setOpen={setOpen}
                    onSuccess={() => {
                        setOpen(false);
                        fetchTheatres();
                    }}
                />

            </header>
        </div>
    );
}

export default Partner;
