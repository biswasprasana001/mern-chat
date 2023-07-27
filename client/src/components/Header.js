import React from 'react';
import { Avatar } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <Avatar />
      <div className="header__search">
        <SearchOutlined />
        <input type="text" placeholder="Search" />
      </div>
      {/* Header Icons */}
    </div>
  );
}

export default Header;
