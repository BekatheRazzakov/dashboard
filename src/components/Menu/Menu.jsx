import React, {useState} from 'react';
import logo from '../../assets/dashboard-logo.svg';
import {ReactComponent as Donut} from '../../assets/donut-graph.svg';
import {ReactComponent as Earth} from '../../assets/earth.svg';
import {ReactComponent as Location} from '../../assets/location.svg';
import {ReactComponent as Arrow} from '../../assets/arrow-right.svg';
import './menu.css';

const Menu = () => {
  const [currentMenu, setCurrentMenu] = useState('stat');

  return (
    <div className="menu">
      <div className="logo">
        <img src={logo} alt="logo"/>
        <span>Dashboard</span>
      </div>
      <div className="menu-items">
        <div className={`menu-item ${currentMenu === 'stat' ? 'menu-item-selected' : ''}`} onClick={() => setCurrentMenu('stat')}>
          <span className="menu-item-inner">
            <Donut />
            Статистика
          </span>
        </div>
        <div className={`menu-item ${currentMenu === 'reg' ? 'menu-item-selected' : ''}`} onClick={() => setCurrentMenu('reg')}>
          <span className="menu-item-inner">
            <Earth />
            Регионы
          </span>
        </div>
        <div className={`menu-item ${currentMenu === 'loc' ? 'menu-item-selected' : ''}`} onClick={() => setCurrentMenu('loc')}>
          <span className="menu-item-inner">
            <Location />
            Квадрат
            <div className="menu-item-location">
              <Arrow />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;