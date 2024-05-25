import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

function MainSidebar({ MainPageState }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleMenuItemClick = (label) => {
    setActiveItem(label);
    MainPageState(label);
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className='sideBar'>
      <button onClick={handleToggleSidebar}>Toggle Sidebar</button>
      <Sidebar collapsed={collapsed}>
        <Menu
          menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: '#13395e',
                color: '#b6c8d9',
              },
            },
          }}
        >
          <SubMenu label="Missions">
            <MenuItem
              onClick={() => handleMenuItemClick('Mes Missions')}
              className={activeItem === 'Mes Missions' ? 'Menuactive' : ''}
            >
              Mes Missions
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('Missions traitement')}
              className={activeItem === 'Missions traitement' ? 'Menuactive' : ''}
            >
              Missions traitement
            </MenuItem>
          </SubMenu>
          <MenuItem
            onClick={() => handleMenuItemClick('Entités')}
            className={activeItem === 'Entités' ? 'Menuctive' : ''}
          >
            Entités
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick('Services')}
            className={activeItem === 'Services' ? 'Menuactive' : ''}
          >
            Services
          </MenuItem>

          <SubMenu label="Paramètres">
            <MenuItem
              onClick={() => handleMenuItemClick('Utilisateurs')}
              className={activeItem === 'Utilisateurs' ? 'Menuactive' : ''}
            >
              Utilisateurs
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
      
    </div>
  );
}

export default MainSidebar;
