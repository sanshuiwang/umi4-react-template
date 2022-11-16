import { Fragment, FC } from "react";
import { Button, Form, Input } from "antd";
import styles from "./index.less";

function Login() {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      <main className={styles.mainForm}>
        <Form
          name="loginForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item>
            <h1 className={styles.loginTitle}>LOGIN</h1>
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
                len: 50,
              },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
                len: 50,
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </main>
    </Fragment>
  );
}

export default Login;
