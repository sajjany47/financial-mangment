import { Outlet } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import Topbar from "./Topbar";
import { useSelector } from "react-redux";
import Login from "./Login";

const Layout = () => {
  const user = useSelector((state) => state.user?.user);
  console.log(user);
  return (
    <>
      {user.acccessToken ? (
        <div className="App">
          <SidebarLayout />
          <div className="main-content">
            <Topbar />
            {/* Add your main content here */}
            <Outlet />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Layout;
