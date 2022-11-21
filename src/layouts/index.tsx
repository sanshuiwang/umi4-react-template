import { Fragment } from "react";
import { Outlet } from "umi";

export default function Layout() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}
