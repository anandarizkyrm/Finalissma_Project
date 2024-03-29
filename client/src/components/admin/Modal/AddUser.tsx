import { Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Col, Form, Input, Row, Select } from "antd";
import { handleChange } from "../../../utils/utils";
import { addUser } from "../../../actions/user";

const { Option } = Select;

const Add_User = ({ setAddUserModal, addUserModal, setAlert }: any) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const handleCancel = () => {
    setAddUserModal(false);
  };

  const [state, setState] = React.useState({
    name: null,
    email: "",
    role: null,
    phone: 0,
    jk: null,
    password: null,
  });

  const handleOk = () => {
    setAddUserModal(false);
    dispatch(addUser(state, setAlert, setState, form));
  };

  return (
    <>
      <Modal
        title="Tambah Pengguna"
        style={{ width: "100%" }}
        visible={addUserModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="w-full">
          <Form
            style={{ width: "100%" }}
            layout="vertical"
            hideRequiredMark
            form={form}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: "Masukan Nama" }]}
                >
                  <Input
                    onChange={(e) => handleChange(e, state, setState)}
                    name="name"
                    placeholder="Masukan Nama"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "example@mail.com" }]}
                >
                  <Input
                    onChange={(e) => handleChange(e, state, setState)}
                    style={{ width: "100%" }}
                    name="email"
                    placeholder="example@mail.com"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true, message: "Masukan Nomor Telepon" }]}
                >
                  <Input
                    onChange={(e) => handleChange(e, state, setState)}
                    style={{ width: "100%" }}
                    name="phone"
                    placeholder="Masukan Nomor Telepon"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="jk"
                  label="Jenis Kelamin"
                  rules={[{ required: true, message: "Pilih Jenis Kelamin" }]}
                >
                  <Select
                    placeholder="Pilih Jenis Kelamin"
                    onChange={(e) => setState({ ...state, jk: e })}
                  >
                    <Option value="Laki-Laki">Laki - Laki</Option>
                    <Option value="Perempuan">Perempuan</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: "Pilih Role" }]}
                >
                  <Select
                    onChange={(e) => setState({ ...state, role: e })}
                    placeholder="Pilih Role"
                  >
                    <Option value="admin">Admin</Option>
                    <Option value="guru">Guru</Option>
                    <Option value="siswa">Siswa</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "example@mail.com" }]}
                >
                  <Input
                    type="password"
                    onChange={(e) => handleChange(e, state, setState)}
                    style={{ width: "100%" }}
                    name="password"
                    placeholder="Enter Password"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Add_User;
