/* eslint-disable react/prop-types */
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { BreadCrumb } from "primereact/breadcrumb";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/reducer/UserReducer";
import { logout } from "./UserService";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "../shared/Config";
import { capitalizeFirstLetter } from "../shared/constant";

export default function Topbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const path = location.pathname.split("/");
  const filterPath = path.filter((item) => item !== "");

  const dispatch = useDispatch();
  const menuRef = useRef();
  const items = filterPath.map((e) => ({ label: capitalizeFirstLetter(e) }));
  // [
  //   { label: "Electronics" },
  //   { label: "Computer" },
  //   { label: "Accessories" },
  // ];
  const home = { icon: "pi pi-home", url: "http://localhost:5173/" };
  const start = <BreadCrumb model={items} home={home} />;
  const end = (
    <div className="flex align-items-center gap-2">
      <h4> {user.data.name}</h4>
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

  const logoutUser = () => {
    logout().then((res) => {
      Swal.fire({
        title: res.message,
        icon: "success",
      });
    });
    dispatch(
      setUser({
        data: {},
        acccessToken: "",
        refreshToken: "",
      })
    );
    sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    navigate("/");
  };

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
            logoutUser();
          },
        },
      ],
    },
  ];

  return (
    <div className="card mb-3 topbar">
      <Menubar
        start={start}
        end={end}
        style={{ marginLeft: props.marginValue }}
      />
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
