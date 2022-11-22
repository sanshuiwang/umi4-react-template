import { Fragment, useEffect } from "react";
import { compose } from "redux";
import { connect } from "umi";
import { Button, Form, Input, message } from "antd";
import { reap } from "safe-reaper";
import styles from "./index.less";
interface IProps {
  getTodos: Function;
  userInfo: object;
}

function Todo(props: IProps) {
  const { getTodos, userInfo } = props;

  useEffect(() => {
    console.log(">>> useEffect <<<");
    getTodos();
  }, []);

  return (
    <Fragment>
      <h3>用户名：{reap(userInfo, "username", "")}</h3>
    </Fragment>
  );
}

const mapStateToProps = ({ loading, login }: any) => ({
  loading,
  userInfo: login.userInfo,
});

const mapDispatchToProps = (dispatch: Function) => ({
  getTodos: (params: object) =>
    dispatch({
      type: `todo/getTodos`,
      payload: {
        ...params,
      },
    }),
  updateState: (params: object) =>
    dispatch({
      type: `todo/updateState`,
      payload: {
        ...params,
      },
    }),
});
const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(Todo);
