import { Outlet } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import Topbar from "./Topbar";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import PasswordChange from "./PasswordChange";
import { setUser } from "../store/reducer/UserReducer";

const Layout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const [visible, setVisible] = useState(true);
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
              <SidebarLayout />
              <div className="main-content">
                <Topbar />
                {/* Add your main content here */}
                <Outlet />
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
