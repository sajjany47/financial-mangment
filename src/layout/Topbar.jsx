import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { BreadCrumb } from "primereact/breadcrumb";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducer/UserReducer";

export default function Topbar() {
  const dispatch = useDispatch();
  const menuRef = useRef();
  const items = [
    { label: "Electronics" },
    { label: "Computer" },
    { label: "Accessories" },
  ];
  const home = { icon: "pi pi-home", url: "https://primereact.org" };
  const start = <BreadCrumb model={items} home={home} />;
  const end = (
    <div className="flex align-items-center gap-2">
      <h4> Sajjan Yadav</h4>
      <Avatar
        size="large"
        style={{
          backgroundColor: "#2196F3",
          color: "#ffffff",
          cursor: "pointer",
        }}
        onClick={(event) => menuRef.current.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
    </div>
  );

  const menuTemplate = [
    {
      //   label: "Profile",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
        },
        {
          label: "Messages",
          icon: "pi pi-inbox",
          badge: 2,
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",

          command: () => {
            console.log("first");
            dispatch(
              setUser({
                data: {},
                acccessToken: "",
                refreshToken: "",
              })
            );
            sessionStorage.removeItem("token");
          },
        },
      ],
    },
  ];

  return (
    <div className="card">
      <Menubar start={start} end={end} />
      <Menu
        model={menuTemplate}
        popup
        ref={menuRef}
        id="popup_menu_left"
        className="w-full md:w-15rem"
      />
    </div>
  );
}
