import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { getAllTheatres, approveTheatre } from "../../api/theatres";

function TheatreTable() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await getAllTheatres();

      if (res.success) {
        setTheatres(res.data);
      } else {
        message.error(res.message);
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

  const handleApprove = async (id) => {
    try {
      const res = await approveTheatre({ theatreId: id });

      if (res.success) {
        message.success(res.message);
        fetchTheatres();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Theatre", dataIndex: "name" },
    { title: "Address", dataIndex: "address" },
    {
      title: "Owner",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.owner?.name}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {record.owner?.email}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, record) =>
        record.isActive ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: "Action",
      render: (_, record) =>
        !record.isActive && (
          <Tooltip title="Approve">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record._id)}
            />
          </Tooltip>
        ),
    },
  ];

  return (
    <div>
      <h2>Admin Theatres</h2>
      <Table
        columns={columns}
        dataSource={theatres}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
}

export default TheatreTable;