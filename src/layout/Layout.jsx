import { Outlet } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import Topbar from "./Topbar";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import PasswordChange from "./PasswordChange";
import { setUser } from "../store/reducer/UserReducer";

const Layout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const [visible, setVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.innerWidth > 540 ? false : true);
  }, []);
  const dislogeClose = () => {
    setVisible(false);
    dispatch(
      setUser({
        data: { ...user.data, isPasswordReset: true },
        acccessToken: user.acccessToken,
        refreshToken: user.refreshToken,
      })
    );
  };

  const getCollapased = (e) => {
    setCollapsed(e);
  };
  return (
    <>
      {user.acccessToken ? (
        <>
          {!user.data.isPasswordReset ? (
            <Dialog
              draggable={false}
              closeIcon={false}
              visible={visible}
              style={{ width: "45vw" }}
              className="customDialoge"
              onHide={() => {
                if (!visible) return;
                setVisible(false);
              }}
            >
              <PasswordChange dislogeClose={dislogeClose} type="user" />
            </Dialog>
          ) : (
            <div className="App">
              <SidebarLayout getCollapased={getCollapased} />

              <div
                className="main-content"
                style={{ flex: 1, marginLeft: collapsed ? "50px" : "250px" }}
              >
                <Topbar marginValue={collapsed ? "15px" : "1px"} />
                {/* Add your main content here */}
                <div style={{ marginLeft: collapsed ? "15px" : "1px" }}>
                  <Outlet />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Layout;
