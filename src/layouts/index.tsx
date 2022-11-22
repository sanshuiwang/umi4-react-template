import { Fragment, useEffect } from "react";
import { Outlet, connect, useLocation } from "umi";
import { compose } from "redux";
import { Spin } from "antd";

interface IProps {
  getUsers: Function;
  isLoading: boolean;
}

function Layout(props: IProps) {
  const { getUsers, isLoading } = props;
  const { pathname } = useLocation();

  useEffect(() => {
    // 获取用户信息
    if (pathname !== "/login") {
      getUsers();
    }
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Outlet />
    </Spin>
  );
}

const mapStateToProps = ({ loading }: any) => ({
  isLoading: loading.effects["login/getUsers"] || false,
});

const mapDispatchToProps = (dispatch: Function) => ({
  getUsers: (params: object) =>
    dispatch({
      type: `login/getUsers`,
      payload: {
        ...params,
      },
    }),
});
const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(Layout);
