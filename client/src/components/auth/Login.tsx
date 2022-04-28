import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import { handleChange } from "../../utils/utils";
import { login } from "../../actions/user";
import { useDispatch } from "react-redux";
import { AlertComponents } from "../alert/Alert";
import { getCookie } from "../../utils/utils";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", typeAlert: 0 });
  const isLog = getCookie("token");
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isLog) {
      navigate("/");
    }
  }, [isLog]);

  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
  };

  const handleSubmit = (): void => {
    dispatch(login(state.email, state.password, setAlert));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        padding: "80px",
      }}
    >
      <Card
        bordered={true}
        style={{ width: 600, background: "none", border: "none" }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
        >
          <h1 className="text-xl font-semibold text-gray-400">
            Welcome To The App
          </h1>
          <h1 className="text-4xl font-bold">
            Please Login Down Below<span>.</span>
          </h1>
          <Form.Item
            name="Email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              name="email"
              placeholder="Email"
              style={{
                borderRadius: "30px",
                padding: "10px",
                paddingLeft: "20px",
              }}
              onChange={(e) => handleChange(e, state, setState)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              name="password"
              placeholder="Password"
              onChange={(e) => handleChange(e, state, setState)}
              style={{
                borderRadius: "30px",
                padding: "10px",
                paddingLeft: "20px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            // wrapperCol={{ offset: 8, span: 16 }}
          >
            <Typography>
              Already Have an Account?{" "}
              <a className="font-bold" onClick={() => navigate("/register")}>
                Click Here
              </a>
            </Typography>
          </Form.Item>

          <Form.Item>
            <Button shape="round" size="large" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {alert.message !== null ? (
        <AlertComponents alert={alert} setAlert={setAlert} />
      ) : null}
    </div>
  );
}

export default Login;
