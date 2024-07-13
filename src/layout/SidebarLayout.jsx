import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import sidebarMenu from "./SidebarMenu";
import { useEffect, useState } from "react";

const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.innerWidth > 540 ? false : true);
  }, []);
  return (
    <>
      <Sidebar style={{ height: "100vh" }} collapsed={collapsed}>
        <Menu>
          <MenuItem
            onClick={() => setCollapsed(!collapsed)}
            icon={<i className={"pi pi-bars"}></i>}
            style={{ marginTop: "5px" }}
          >
            <h4>Admin</h4>
          </MenuItem>
          {sidebarMenu.admin.map((item, index) => {
            return item.submenu ? (
              <SubMenu
                label={item.title}
                key={index}
                icon={<i className={item.icon}></i>}
                style={{ marginTop: "1px" }}
              >
                {item.submenu.map((res, ind) => {
                  return (
                    <MenuItem key={ind} icon={<i className={res.icon}></i>}>
                      {" "}
                      {res.title}{" "}
                    </MenuItem>
                  );
                })}
              </SubMenu>
            ) : (
              <MenuItem
                key={index}
                icon={<i className={item.icon}></i>}
                style={{ marginTop: "5px" }}
              >
                {item.title}
              </MenuItem>
            );
          })}
        </Menu>
      </Sidebar>
    </>
  );
};

export default SidebarLayout;
