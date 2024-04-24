import React, {useState} from 'react';
import DatePicker from "../../components/DatePicker/DatePicker";
import './dashboard.css';

const Dashboard = () => {
  const [state, setState] = useState({
    date1: '',
    date2: '',
  });

  const changeHandler = (value) => {
    if (!state.date1) {
      setState(() => ({
        date1: value,
        date2: '',
      }));
    } else if (state.date1 && !state.date2) {
      setState(prevState => ({
        ...prevState,
        date2: value,
      }));
    } else if (state.date1 && state.date2) {
      setState(() => ({
        date1: value,
        date2: '',
      }));
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="pwd">Страницы / Регионы</span>
        <span className="current-page-name">Регионы</span>
      </div>
      <div className="statistics">
        <div className="paper abons-in-numbers"></div>
        <div className="paper date-picker-block">
          <DatePicker
            date1={state.date1}
            date2={state.date2}
            changeHandler={changeHandler}
          />
        </div>
        <div className="paper percentage"></div>
        <div className="paper si-rating"></div>
        <div className="paper abons-in-graphs"></div>
        <div className="paper tariffs"></div>
      </div>
    </div>
  );
};

export default Dashboard;