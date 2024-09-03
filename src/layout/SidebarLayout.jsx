import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import sidebarMenu from "./SidebarMenu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Position } from "../shared/Config";
import { NavLink, Outlet } from "react-router-dom";
import { capitalizeFirstLetter } from "../shared/constant";
import Topbar from "./Topbar";

const SidebarLayout = () => {
  const user = useSelector((state) => state.user?.user);
  const [userMenu, setUserMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const a = user.data.position;
    const role =
      a === Position.ADMIN
        ? sidebarMenu.admin
        : a === Position.BM
        ? sidebarMenu["branch-manager"]
        : a === Position.CD
        ? sidebarMenu["collection-department"]
        : a === Position.CDM
        ? sidebarMenu["collection-department-head"]
        : a === Position.CUSTOMER
        ? sidebarMenu.customer
        : a === Position.FM
        ? sidebarMenu["financial-manager"]
        : a === Position.LD
        ? sidebarMenu["loan-department"]
        : a === Position.LM
        ? sidebarMenu["loan-manager"]
        : a === Position.PM
        ? sidebarMenu["state-manager"]
        : a === Position.VD
        ? sidebarMenu["verication-department"]
        : [];
    setUserMenu(role);
    setCollapsed(window.innerWidth > 540 ? false : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <Sidebar
          style={{ height: "100%" }}
          className={` ${collapsed ? "sidebar collapsed" : "sidebar"}`}
          collapsed={collapsed}
        >
          <Menu>
            <MenuItem
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              icon={<i className={"pi pi-bars"}></i>}
              style={{ marginTop: "5px" }}
            >
              <h4>{capitalizeFirstLetter(user.data.position)}</h4>
            </MenuItem>
            {userMenu.map((item, index) => {
              return item.submenu ? (
                <SubMenu
                  label={item.title}
                  key={index}
                  icon={<i className={item.icon}></i>}
                  style={{ marginTop: "1px" }}
                >
                  {item.submenu.map((res, ind) => {
                    return (
                      <MenuItem
                        key={ind}
                        icon={<i className={res.icon}></i>}
                        component={<NavLink to={res.route} />}
                      >
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
                  component={<NavLink to={item.route} />}
                >
                  {item.title}
                </MenuItem>
              );
            })}
          </Menu>
        </Sidebar>

        <main className="main-content">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
