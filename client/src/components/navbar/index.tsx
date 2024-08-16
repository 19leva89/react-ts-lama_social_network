import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext, AuthContextType } from "../../context/authContext";
import { DarkModeContext, DarkModeContextType } from "../../context/darkModeContext";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext) as DarkModeContextType;
  const { currentUser } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="navbar">
      <div className="navbar__left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>dimasocial</span>
        </Link>

        <Link
          to={`/profile/${currentUser?.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <HomeOutlinedIcon />
        </Link>

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}

        <GridViewOutlinedIcon />

        <div className="navbar__left--search">
          <SearchOutlinedIcon />
          <input type="text" id="search" name="search" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar__right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="navbar__right--user">
          <img src={"/upload/" + currentUser?.profilePicture} alt="" />
          <span>{currentUser?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
