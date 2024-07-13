import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import sidebarMenu from "./SidebarMenu";

const SidebarLayout = () => {
  return (
    <>
      <Sidebar style={{ height: "100vh" }}>
        <Menu>
          <MenuItem icon={<i className={""}></i>} style={{ marginTop: "5px" }}>
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
