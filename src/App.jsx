import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";
import "./App.css";
import sidebarMenu from "./layout/SidebarMenu";

function App() {
  return (
    <>
      <Sidebar>
        <Menu>
          {sidebarMenu.admin.map((item, index) => {
            return item.submenu ? (
              <SubMenu
                label={item.title}
                key={index}
                icon={<i className={item.icon}></i>}
              >
                {item.submenu.map((res, ind) => {
                  return <MenuItem key={ind}> {res.title} </MenuItem>;
                })}
              </SubMenu>
            ) : (
              <MenuItem key={index} icon={<i className={`${item.icon}`}></i>}>
                {item.title}
              </MenuItem>
            );
          })}
        </Menu>
      </Sidebar>
      ;
    </>
  );
}

export default App;
