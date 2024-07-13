import SidebarLayout from "./SidebarLayout";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <div className="App">
      <SidebarLayout />
      <div className="main-content">
        <Topbar />
        {/* Add your main content here */}
      </div>
    </div>
  );
};

export default Layout;
