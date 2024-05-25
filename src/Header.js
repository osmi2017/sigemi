import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logout from './icon/icons8-logout-50.png';
import { clearToken } from './actions/actions'; // Assuming you have the clearToken action defined in your actions file

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Access the navigate function

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Dispatch the clearToken action to remove the token from Redux store
    dispatch(clearToken());

    // Use navigate to redirect to the login page
    navigate('/login');
  };

  return (
    <div className="mainheader">
      <ul className="nav justify-content-end">
        <li>
          <a href="#" className='deconnection' onClick={handleLogout}>
            <img src={logout} alt="Logout" className="logoutIcon" /> Déconnexion
          </a>
        </li>
      </ul>
      {isMenuOpen && (
        <div className="collapse" id="myNavbar">
          {/* Add your menu items here */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">Item 1</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Item 2</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Item 3</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
