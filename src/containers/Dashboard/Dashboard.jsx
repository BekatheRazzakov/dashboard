import React, {useEffect, useState} from 'react';
import DatePicker from "../../components/DatePicker/DatePicker";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import moment from "moment";
import {setDateFieldName} from "../../features/dataSlice";
import {fetchAbonsData} from "../../features/dataThunk";
import {ResponsiveLine} from "@nivo/line";
import './dashboard.css';

const data = [
  {
    "id": "ААБ",
    "color": '#1DBF12',
    "data": [
      {
        "x": 'Апр 13',
        "y": "3054"
      },
      {
        "x": 'Апр 14',
        "y": "3708"
      },
      {
        "x": 'Апр 15',
        "y": "3690"
      },
      {
        "x": 'Апр 16',
        "y": "3560"
      },
      {
        "x": 'Апр 17',
        "y": "3800"
      },
      {
        "x": 'Апр 18',
        "y": "3850"
      },
      {
        "x": 'Апр 19',
        "y": "3825"
      },
      {
        "x": 'Апр 20',
        "y": "3900"
      },
      {
        "x": 'Апр 21',
        "y": "3930"
      },
      {
        "x": 'Апр 22',
        "y": "3870"
      },
      {
        "x": 'Апр 23',
        "y": "3890"
      },
      {
        "x": 'Апр 24',
        "y": "3920"
      },
    ],
  },
  {
    "id": "НАБ",
    "color": '#E31A1A',
    "data": [
      {
        "x": 'Апр 15',
        "y": "567"
      },
      {
        "x": 'Апр 16',
        "y": "550"
      },
      {
        "x": 'Апр 17',
        "y": "545"
      },
      {
        "x": 'Апр 18',
        "y": "557"
      },
      {
        "x": 'Апр 19',
        "y": "540"
      },
      {
        "x": 'Апр 20',
        "y": "530"
      },
      {
        "x": 'Апр 21',
        "y": "538"
      },
      {
        "x": 'Апр 22',
        "y": "500"
      },
      {
        "x": 'Апр 23',
        "y": "490"
      }
    ],
  },
  {
    "id": "Отклонение",
    "color": '#4318FF',
    "data": [
      {
        "x": 'Апр 15',
        "y": "13"
      },
      {
        "x": 'Апр 16',
        "y": "12.5"
      },
      {
        "x": 'Апр 17',
        "y": "12.8"
      },
      {
        "x": 'Апр 18',
        "y": "11.2"
      },
      {
        "x": 'Апр 19',
        "y": "11.9"
      },
      {
        "x": 'Апр 20',
        "y": "13"
      },
      {
        "x": 'Апр 21',
        "y": "13.5"
      },
      {
        "x": 'Апр 22',
        "y": "12.4"
      },
      {
        "x": 'Апр 23',
        "y": "12"
      }
    ],
  },
];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const dateFieldName = useAppSelector(state => state.dataState.dateFieldName);
  const abonsData = useAppSelector(state => state.dataState.abonsData);
  const [state, setState] = useState({
    periodDate1: moment().subtract(7, 'days').format('DD.MM.YYYY'),
    periodDate2: moment().subtract(1, 'days').format('DD.MM.YYYY'),
    abonsNumDate: moment().subtract(1, 'days').format('DD.MM.YYYY'),
  });
  const [currentLineChart, setCurrentLineChart] = useState('aab');
  const aabPercentage = Number(((abonsData.aab || 0) / (abonsData.oab || 0) * 100).toFixed(2));
  const otkloneniePercentage = Number((aabPercentage - 90).toFixed(2));
  const otklonenieKolvo = Number((((abonsData.oab || 0) / 100 * 90) / 100 * otkloneniePercentage).toFixed());
  const minY = Math.min(...[data[
    currentLineChart === 'aab' ? 0 :
      currentLineChart === 'nab' ? 1 :
        currentLineChart === 'otkl' ? 2 : 0
    ]].flatMap(series => series.data.map(d => parseInt(d.y))));
  const maxY = Math.max(...[data[
    currentLineChart === 'aab' ? 0 :
      currentLineChart === 'nab' ? 1 :
        currentLineChart === 'otkl' ? 2 : 0
    ]].flatMap(series => series.data.map(d => parseInt(d.y))));
  const tickStep =
    currentLineChart === 'aab' ? 200 :
      currentLineChart === 'nab' ? 50 :
        currentLineChart === 'otkl' ? 4 : 0;
  const tickValues = Array.from({length: Math.ceil((maxY - minY) / tickStep) + 1}, (_, index) => minY + index * tickStep);

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
            <span className="abons-card-value">{otklonenieKolvo}</span>
          </div>
          <div className="abons-otk-per">
            <span className="abons-card-title">Отклонение %</span>
            <span className="abons-card-value">{otkloneniePercentage}%</span>
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
                fontWeight: '700',
                fontSize: '12px',
                color: 'var(--blue-secondary)',
                lineHeight: '18px',
                marginTop: '30px'
              }}
            >Всего абонентов</span>
            <span
              style={{
                fontWeight: '700', fontSize: '24px', color: 'var(--primary)', lineHeight: '36px',
              }}
            >{abonsData.oab}</span>
            <div className="abon-types">
              <span
                className={currentLineChart === 'aab' ? "abon-type-aab" : ''}
                onClick={() => setCurrentLineChart('aab')}
              >ААБ</span>
              <span
                className={currentLineChart === 'nab' ? "abon-type-nab" : ''}
                onClick={() => setCurrentLineChart('nab')}
              >НАБ</span>
              <span
                className={currentLineChart === 'otkl' ? "abon-type-otkl" : ''}
                onClick={() => setCurrentLineChart('otkl')}
              >Отклонение</span>
            </div>
          </div>
          <div className="abons-chart">
            <ResponsiveLine
              width={650}
              data={
                currentLineChart === 'aab' ? [data[0]] :
                  currentLineChart === 'nab' ? [data[1]] :
                    currentLineChart === 'otkl' ? [data[2]] : []
              }
              colors={[
                currentLineChart === 'aab' ? ['#1DBF12'] :
                  currentLineChart === 'nab' ? ['#E31A1A'] :
                    currentLineChart === 'otkl' ? ['#4318FF'] : []
              ]}
              motionConfig="gentle"
              margin={{top: 50, right: 160, bottom: 50, left: 60}}
              curve="catmullRom"
              enableCrosshair={false}
              crosshairType="bottom-right"
              axisTop={null}
              axisRight={{
                tickValues: currentLineChart === 'otkl' ? [0, 10, 20, 30, 40, 50] : tickValues,
                tickSize: 10,
                tickPadding: 8,
                tickRotation: 0,
                format: '.2s',
              }}
              axisBottom={{
                tickValues:
                  data[currentLineChart === 'aab' ? 0 :
                    currentLineChart === 'nab' ? 1 :
                      currentLineChart === 'otkl' ? 2 : 0].data.map(point => point.x),
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                format: value => value,
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={null}
              pointBorderWidth={1}
              enableTouchCrosshair={true}
              useMesh={true}
              yScale={{
                type: 'linear',
                min: currentLineChart === 'otkl' ? 0 : 'auto',
                max: currentLineChart === 'otkl' ? 50 : tickValues[tickValues.length - 1],
                stacked: false,
                reverse: false
              }}
              yFormat={value => (value < minY ? null : value)}
              tooltip={({point}) => (
                <div
                  style={{
                    background: point.color, padding: '4px 16px 2px',
                    color: 'white', borderRadius: '8px', textAlign: 'center',
                  }}
                >
                  <div style={{fontSize: '12px', opacity: '0.7'}}>{point.data.x}</div>
                  <div style={{fontWeight: '700', lineHeight: '24px'}}>{point.data.y}</div>
                </div>
              )}
            />
          </div>
        </div>
        <div className="paper tariffs"></div>
      </div>
    </div>
  );
};

export default Dashboard;