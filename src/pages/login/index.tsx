import { Fragment } from "react";
import { compose } from "redux";
import { connect } from "umi";
import { Button, Form, Input, message } from "antd";

import styles from "./index.less";

function Login() {
  const [loginForm] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
    loginForm
      .validateFields()
      .then((values) => {
        /**
         * 向API发送请求
         */
      })
      .catch((errorInfo) => {
        message.error(errorInfo);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Login Error!");
  };

  return (
    <Fragment>
      <main className={styles.mainForm}>
        <Form
          form={loginForm}
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
                max: 50,
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
                max: 50,
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
const mapStateToProps = ({ loading }: any) => ({
  loading,
});

const mapDispatchToProps = (dispatch: Function) => ({
  getUsers: (params: object) => {
    dispatch({
      type: `loginModel/getUsers`,
      payload: {
        ...params,
      },
    });
  },
  updateState: (params: object) => {
    dispatch({
      type: `loginModel/updateState`,
      payload: {
        ...params,
      },
    });
  },
});
const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(Login);
