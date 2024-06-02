import React, { useEffect, useState } from 'react';
import logo from '../../assets/dashboard-logo.png';
import { ReactComponent as Donut } from '../../assets/donut-graph.svg';
import { ReactComponent as Earth } from '../../assets/earth.svg';
import { ReactComponent as Location } from '../../assets/location.svg';
import { ReactComponent as Arrow } from '../../assets/arrow-right.svg';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setTab, setCurrentSquare } from "../../features/dataSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSquares } from "../../features/dataThunk";
import { ReactComponent as ArrowRight } from "../../assets/region-arrow-right.svg";
import './menu.css';

const Menu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentMenu = useAppSelector(state => state.dataState.currentTab);
  const squares = useAppSelector(state => state.dataState.squares);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSquare, setSelectedSquare] = useState(-1);
  
  useEffect(() => {
    dispatch(fetchSquares());
  }, [dispatch]);
  
  return (<div className="menu">
    <div className="logo">
      <img src={logo} alt="logo"/>
      <span>Dashboard</span>
    </div>
    <div className="menu-items">
      <div
        className={`menu-item ${currentMenu === 'stat' ? 'menu-item-selected' : ''}`}
        onClick={() => {
          dispatch(setTab('stat'));
          navigate('statistics');
        }}
      >
          <span className="menu-item-inner">
            <Donut/>
            Статистика
          </span>
      </div>
      <div
        className={`menu-item ${currentMenu === 'reg' ? 'menu-item-selected' : ''}`}
        onClick={() => {
          dispatch(setTab('reg'));
          navigate('regions');
        }}
      >
          <span className="menu-item-inner">
            <Earth/>
            Регионы
          </span>
      </div>
      <div style={{position: 'relative', opacity: location.pathname === '/regions' ? 0.5 : 1}}>
        {/*{location.pathname === '/regions' && <div className="menu-item-disabler"></div>}*/}
        <div
          className={`menu-item ${currentMenu === 'loc' ? 'menu-item-selected' : ''}`}
          onClick={() => {
            if (currentMenu === 'loc') {
              dispatch(setTab('stat'));
            } else dispatch(setTab('loc'));
          }}
        >
          <span className="menu-item-inner">
            <Location/>
            Квадрат
            <div className="menu-item-location">
              <Arrow/>
            </div>
          </span>
        </div>
        {
          currentMenu === 'loc' && <div className="menu-item-squares">
            {
              Object.keys(squares).map((key) => (
                <div key={key}>
                  <div
                    className={`menu-item ${selectedRegion === key ? 'menu-item-selected' : ''}`}
                    onClick={() => {
                      if (selectedRegion === key) {
                        setSelectedRegion('');
                      } else setSelectedRegion(key);
                    }}
                  >
                    <span className="menu-item-inner menu-item-region">
                      {key}
                      <ArrowRight/>
                    </span>
                  </div>
                  <div className="region-squares">
                    {
                      selectedRegion === key && squares[key].map((square) => (
                        <div
                          className={`menu-item ${selectedSquare === square.id ? 'menu-item-selected' : ''}`}
                          onClick={() => {
                            if (selectedSquare === square.id) {
                              setSelectedSquare('');
                              return dispatch(setCurrentSquare(''));
                            }
                            setSelectedSquare(square.id);
                            dispatch(setCurrentSquare(square));
                          }}
                          key={square.id}
                        >
                          <span className="menu-item-inner menu-item-region-square">
                            {square.square}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        }
      </div>
    </div>
  </div>);
};

export default Menu;