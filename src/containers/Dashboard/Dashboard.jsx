import React from 'react';
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="pwd">Страницы / Регионы</span>
        <span className="current-page-name">Регионы</span>
      </div>
      <div className="statistics">
        <div className="paper abons-in-numbers"></div>
        <div className="paper date-picker-block"></div>
        <div className="paper percentage"></div>
        <div className="paper si-rating"></div>
        <div className="paper abons-in-graphs"></div>
        <div className="paper tariffs"></div>
      </div>
    </div>
  );
};

export default Dashboard;