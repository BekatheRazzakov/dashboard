import React, {useEffect, useState} from 'react';
import DatePicker from "../../components/DatePicker/DatePicker";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import moment from "moment";
import {setDateFieldName} from "../../features/dataSlice";
import './dashboard.css';
import {fetchAbonsData} from "../../features/dataThunk";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const dateFieldName = useAppSelector(state => state.dataState.dateFieldName);
  const abonsData = useAppSelector(state => state.dataState.abonsData);
  const [state, setState] = useState({
    periodDate1: moment().subtract(7, 'days').format('DD.MM.YYYY'),
    periodDate2: moment().subtract(1, 'days').format('DD.MM.YYYY'),
    abonsNumDate: moment().subtract(1, 'days').format('DD.MM.YYYY'),
  });
  const aabPercentage = Number(((abonsData.aab || 0) / (abonsData.oab || 0) * 100).toFixed(2));
  const otkloneniePercentage = Number((aabPercentage - 90).toFixed(2));
  const otklonenieKolvo = Number((((abonsData.oab || 0) / 100 * 90) / 100 * otkloneniePercentage).toFixed());

  const changeHandler = (value) => {
    if (dateFieldName === 'periodDate1') {
      if (!state.periodDate1) {
        setState(prevState => ({
          ...prevState,
          periodDate1: value,
          date2: '',
        }));
      } else if (state.periodDate1 && !state.periodDate2) {
        if (moment(value, 'DD.MM.YYYY').isBefore(moment(state.periodDate1, 'DD.MM.YYYY'))) {
          setState(prevState => ({
            ...prevState,
            periodDate1: value,
            periodDate2: state.periodDate1,
          }));
        } else {
          setState(prevState => ({
            ...prevState,
            periodDate2: value,
          }));
        }
      } else if (state.periodDate1 && state.periodDate2) {
        setState(prevState => ({
          ...prevState,
          periodDate1: value,
          periodDate2: '',
        }));
      }
    } else if (dateFieldName === 'abonsNumDate') {
      setState(prevState => ({
        ...prevState,
        abonsNumDate: value,
      }));
    }
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  useEffect(() => {
    dispatch(fetchAbonsData({date: state.abonsNumDate}));
  }, [dispatch, state.abonsNumDate]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="pwd">Страницы / Регионы</span>
        <span className="current-page-name">Регионы</span>
      </div>
      <div className="statistics">
        <div
          className="paper abons-in-numbers"
        >
          <div
            className={`abons-in-numbers-date ${dateFieldName === 'abonsNumDate' ? 'abons-in-numbers-date-selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setDateFieldName('abonsNumDate'));
            }}
          >{state.abonsNumDate}</div>
          <div className="abons-oab">
            <span className="abons-card-title">ОАБ</span>
            <span className="abons-card-value">{formatNumber(abonsData.oab)}</span>
          </div>
          <div className="abons-aab">
            <span className="abons-card-title">ААБ</span>
            <span className="abons-card-value abons-card-value-up">{formatNumber(abonsData.aab)}</span>
          </div>
          <div className="abons-nab">
            <span className="abons-card-title">НАБ</span>
            <span className="abons-card-value abons-card-value-down">{formatNumber(abonsData.nab)}</span>
          </div>
          <div className="abons-otk-num">
            <span className="abons-card-title">Отклонение</span>
            <span className="abons-card-value">450</span>
          </div>
          <div className="abons-otk-per">
            <span className="abons-card-title">Отклонение %</span>
            <span className="abons-card-value">-3.04%</span>
          </div>
        </div>
        <div className="paper date-picker-block">
          <DatePicker
            date1={
              dateFieldName === 'periodDate1' ? state.periodDate1 :
                dateFieldName === 'abonsNumDate' ? state.abonsNumDate : ''
            }
            date2={dateFieldName === 'periodDate1' ? state.periodDate2 : ''}
            changeHandler={changeHandler}
          />
        </div>
        <div className="paper percentage"></div>
        <div className="paper si-rating"></div>
        <div className="paper abons-in-graphs">
          <div className="abons-in-graphs-numbers">
            <div
              className={`abons-in-numbers-date ${dateFieldName === 'periodDate1' ? 'abons-in-numbers-date-selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setDateFieldName('periodDate1'));
              }}
            >
              {state.periodDate1 ? moment(state.periodDate1, 'DD.MM.YYYY').format('DD.MM') : '?'}
              {' - '}
              {state.periodDate2 ? moment(state.periodDate2, 'DD.MM.YYYY').format('DD.MM') : '?'}
            </div>
            <span
              style={{
                fontWeight: '700', fontSize: '12px', color: 'var(--blue-secondary)', lineHeight: '18px', marginTop: '30px'
              }}
            >Всего абонентов</span>
            <span
              style={{
                fontWeight: '700', fontSize: '24px', color: 'var(--primary)', lineHeight: '36px',
              }}
            >{abonsData.oab}</span>
            <div className="abon-types">
              <span>ААБ</span>
              <span>НАБ</span>
              <span>Отклонение</span>
            </div>
          </div>
        </div>
        <div className="paper tariffs"></div>
      </div>
    </div>
  );
};

export default Dashboard;