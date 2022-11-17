import { FC } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const antIcon = <LoadingOutlined style={{ fontSize: 84 }} spin />;

const Loading: FC = () => (
  <main style={{ width: "100%", textAlign: "center" }}>
    <Spin indicator={antIcon} />
  </main>
);

export default Loading;
