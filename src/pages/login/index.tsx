import { Fragment } from "react";
import { compose } from "redux";
import { connect } from "umi";
import { Button, Form, Input, message } from "antd";

import styles from "./index.less";
interface IProps {
  isLoading: boolean;
  getUsers: Function;
}

function Login(props: IProps) {
  const { getUsers, isLoading } = props;

  const onFinish = (values: any) => {
    console.log("Success:", values);
    getUsers(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Login Error!");
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
            <Button loading={isLoading} type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </main>
    </Fragment>
  );
}

const mapStateToProps = ({ loading }: any) => ({
  isLoading: loading.effects["login/getUsers"] || false,
});

const mapDispatchToProps = (dispatch: Function) => ({
  getUsers: (params: object) => {
    dispatch({
      type: `login/getUsers`,
      payload: {
        ...params,
      },
    });
  },
  updateState: (params: object) => {
    dispatch({
      type: `login/updateState`,
      payload: {
        ...params,
      },
    });
  },
});
const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(Login);
