import React from "react";
import { Form, Input, Modal, message } from "antd";
import { addTheatre } from "../../api/theatres";

function TheatreForm({ open, setOpen, onSuccess }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const res = await addTheatre(values);

    if (res.success) {
      message.success(res.message || "Theatre submitted");
      form.resetFields();
      onSuccess();
    } else {
      message.error(res.message || "Failed to submit theatre");
    }
  };

  return (
    <Modal
      title="Add Theatre"
      open={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText="Submit"
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Theatre Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Eg: PVR Phoenix" />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[{ required: true }]}>
          <Input.TextArea rows={2} placeholder="Full address" />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input placeholder="Eg: 9876543210" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Eg: manager@theatre.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TheatreForm;