import React, { useEffect, useState } from 'react';
import DatePicker from "../../components/DatePicker/DatePicker";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import moment from "moment";
import { setDateFieldName } from "../../features/dataSlice";
import { fetchAbonsData, fetchAbonsDataArray } from "../../features/dataThunk";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar';
import calendarIcon from '../../assets/calendar.svg';
import defaultAvatar from '../../assets/default-avatar.png';
import CoverLoader from "../../components/CoverLoader/CoverLoader";
import './dashboard.css';

const siRating = [
  {
    name: 'Маликов Кубан',
    podkl: '200',
    tp: '210',
    dem: '34',
  },
  {
    name: 'Айылчы Дуйшобаев',
    podkl: '210',
    tp: '12',
    dem: '17',
  },
  {
    name: 'Ренат Ренатов',
    podkl: '199',
    tp: '24',
    dem: '34',
  },
  {
    name: 'Абдырасул Абдырасулов',
    podkl: '100',
    tp: '75',
    dem: '91',
  },
  {
    name: 'Мурат Муратов',
    podkl: '188',
    tp: '56',
    dem: '39',
  },
  {
    name: 'Сталбек Солто уулу',
    podkl: '163',
    tp: '42',
    dem: '185',
  },
];

const tariffData = [
  {
    id: 'Promo',
    value1: 300,
    value2: 5000
  },
  {
    id: 'Promo 60',
    value1: 280,
    value2: 5150
  },
  {
    id: 'Promo 70',
    value1: 310,
    value2: 5400
  },
  {
    id: 'Promo 80',
    value1: 200,
    value2: 4470
  },
  {
    id: 'Promo 90',
    value1: 390,
    value2: 6340
  },
  {
    id: 'Promo 100',
    value1: 250,
    value2: 4975
  },
  {
    id: 'Sky 90',
    value1: 430,
    value2: 6400
  },
  {
    id: 'Sky 70',
    value1: 220,
    value2: 6800
  },
  {
    id: 'Promo 20',
    value1: 204,
    value2: 6890
  },
];

const Dashboard = ({style, title}) => {
  const dispatch = useAppDispatch();
  const dateFieldName = useAppSelector(state => state.dataState.dateFieldName);
  const abonsData = useAppSelector(state => state.dataState.abonsData);
  const currentSquare = useAppSelector(state => state.dataState.currentSquare);
  const abonsDataArray = useAppSelector(state => state.dataState.abonsDataArray);
  const abonsDataArrayLoading = useAppSelector(state => state.dataState.abonsDataArrayLoading);
  const [state, setState] = useState({
    periodDate1: moment().subtract(7, 'days').format('DD.MM.YYYY'),
    periodDate2: moment().subtract(1, 'days').format('DD.MM.YYYY'),
    abonsNumDate: moment().subtract(1, 'days').format('DD.MM.YYYY'),
  });
  const [siSortBy, setSiSortBy] = useState('podkl');
  const [currentLineChart, setCurrentLineChart] = useState('aab');
  const [fetchAbonDataLoading, setFetchAbonDataLoading] = useState(false);
  const aabPercentage = Number(((abonsData.aab || 0) / (abonsData.oab || 0) * 100).toFixed(2)) || 0;
  const nabPercentage = Number(((abonsData.nab || 0) / (abonsData.oab || 0) * 100).toFixed(2)) || 0;
  const otkloneniePercentage = Number((aabPercentage - 90).toFixed(2)) || 0;
  const otklonenieKolvo = Number((((abonsData.oab || 0) / 100 * 90) / 100 * otkloneniePercentage).toFixed()) || 0;
  const minY = Math.min(...[(abonsDataArray || [])[
    currentLineChart === 'aab' ? 0 :
      currentLineChart === 'nab' ? 1 :
        currentLineChart === 'otkl' ? 2 : 0
    ]].flatMap(series => series?.data.map(d => parseInt(d.y))));
  const maxY = Math.max(...[(abonsDataArray || [])[
    currentLineChart === 'aab' ? 0 :
      currentLineChart === 'nab' ? 1 :
        currentLineChart === 'otkl' ? 2 : 0
    ]].flatMap(series => series?.data.map(d => parseInt(d.y))));
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
    const getData = async () => {
      setFetchAbonDataLoading(true);
      const reformatDate = moment(state.abonsNumDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
      await dispatch(fetchAbonsData(
        {date: reformatDate, square: currentSquare?.id}
      ));
      setFetchAbonDataLoading(false);
    };
    void getData();
  }, [currentSquare, dispatch, state.abonsNumDate]);
  
  useEffect(() => {
    if (state.periodDate1 && state.periodDate2) {
      let startDate = moment(state.periodDate1, "DD.MM.YYYY");
      let endDate = moment(state.periodDate2, "DD.MM.YYYY");
      let dates = [];
      
      while (startDate <= endDate) {
        dates.push(startDate.format("YYYY-MM-DD"));
        startDate = startDate.add(1, 'days');
      }
      dispatch(fetchAbonsDataArray({dates, square: currentSquare?.id}));
    }
  }, [currentSquare?.id, dispatch, state.periodDate1, state.periodDate2]);
  
  return (
    <div className="dashboard" style={{...style, minHeight: window.innerHeight + 'px'}}>
      <div className="dashboard-header">
        <span className="pwd">Страницы / Статистика</span>
        <span className="current-page-name">{title || 'Статистика'}</span>
      </div>
      <div className="statistics">
        <div
          className="paper abons-in-numbers"
        >
          {fetchAbonDataLoading && <CoverLoader/>}
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
        
        
        <div className="paper percentage">
          {fetchAbonDataLoading && <CoverLoader/>}
          <span className="percentage-title">Проценты</span>
          <ResponsivePie
            data={[
              {
                "id": "ААБ",
                "label": "ААБ",
                "value": abonsData.aab,
              },
              {
                "id": "НАБ",
                "label": "НАБ",
                "value": abonsData.nab,
              },
            ]}
            colors={['#1DBF12', '#E31A1A']}
            margin={{top: 15, right: 0, bottom: 20, left: 0}}
            height={203}
            innerRadius={0.6}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            arcLabelsTextColor='#FFFFFF'
            enableArcLabels={false}
            enableArcLinkLabels={false}
            tooltip={() => <div></div>}
          />
          <div className="percentage-percents">
            <div className='percentage-percents-block'>
              <span>ААБ</span>
              <span>{aabPercentage}%</span>
            </div>
            <div className='percentage-percents-block'>
              <span>НАБ</span>
              <span>{nabPercentage}%</span>
            </div>
          </div>
        </div>
        
        
        <div className="paper si-rating">
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h2 className="si-rating-block-title">Рейтинг СИ</h2>
            <div
              className={`abons-in-numbers-date ${dateFieldName === 'abonsNumDate' ? 'abons-in-numbers-date-selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setDateFieldName('abonsNumDate'));
              }}
            >
              <img src={calendarIcon} alt="calendar"/>
              {state.abonsNumDate ? moment(state.abonsNumDate, 'DD.MM.YYYY').format('MMMM') : '-'}
            </div>
          </div>
          <div className="si-rating-titles">
            <span className="si-rating-titles-fio">ФИО</span>
            <span
              className={`si-rating-titles-title ${siSortBy === 'podkl' ? 'si-rating-titles-title-selected' : ''}`}
              onClick={() => setSiSortBy('podkl')}
            >Подкл.</span>
            <span
              className={`si-rating-titles-title ${siSortBy === 'tp' ? 'si-rating-titles-title-selected' : ''}`}
              onClick={() => setSiSortBy('tp')}
            >ТП</span>
            <span
              className={`si-rating-titles-title ${siSortBy === 'dem' ? 'si-rating-titles-title-selected' : ''}`}
              onClick={() => setSiSortBy('dem')}
            >Дем</span>
          </div>
          <div className="si-rating-staff-list">
            {
              siRating.sort((a, b) => parseInt(b[siSortBy]) - parseInt(a[siSortBy]))
              .map(si => (
                <div className="si-rating-staff-item">
                  <div style={{display: 'flex', gap: '9px', alignItems: 'center', flexGrow: 1, maxWidth: '210px'}}>
                    <img src={defaultAvatar} alt="Сервис инженер"/>
                    <span className="si-rating-staff-item-name">{si.name}</span>
                  </div>
                  <span className="si-rating-staff-item-number">{si.podkl}</span>
                  <span className="si-rating-staff-item-number">{si.tp}</span>
                  <span className="si-rating-staff-item-number">{si.dem}</span>
                </div>
              ))
            }
          </div>
        </div>
        
        
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
            >
              {
                abonsDataArray.length ?
                  abonsDataArray[0].data[abonsDataArray[0].data.length - 1]?.y +
                  abonsDataArray[1].data[abonsDataArray[0].data.length - 1]?.y : 0
              }
            </span>
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
              >Отклонение %</span>
            </div>
          </div>
          
          
          <div className="abons-chart">
            {abonsDataArrayLoading && <CoverLoader/>}
            <ResponsiveLine
              data={
                !!abonsDataArray[0]['data'].length &&
                currentLineChart === 'aab' ? [abonsDataArray[0]] :
                  currentLineChart === 'nab' ? [abonsDataArray[1]] :
                    currentLineChart === 'otkl' ? [abonsDataArray[2]] : []
              }
              colors={[
                currentLineChart === 'aab' ? ['#1DBF12'] :
                  currentLineChart === 'nab' ? ['#E31A1A'] :
                    currentLineChart === 'otkl' ? ['#4318FF'] : []
              ]}
              motionConfig="gentle"
              margin={{top: 30, right: 45, bottom: 30, left: 0}}
              curve="catmullRom"
              enableCrosshair={false}
              crosshairType="bottom-right"
              axisTop={null}
              axisRight={{
                tickSize: 5,
                tickPadding: 8,
                tickRotation: 0,
              }}
              axisBottom={null}
              axisLeft={null}
              lineWidth={3}
              pointBorderWidth={2}
              pointSize={8}
              enableTouchCrosshair={true}
              useMesh={true}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: tickValues[tickValues.length - 1],
                stacked: false,
                reverse: false
              }}
              yFormat={value => (value < minY ? null : value)}
              tooltip={({point}) => (
                <div
                  className="responsive-line-tooltip"
                  style={{
                    background: point.color
                  }}
                >
                  <span className="responsive-line-tooltip-pointer" style={{borderTop: `6px solid ${point['color']}`}}/>
                  <div style={{
                    fontSize: '12px',
                    opacity: '0.7'
                  }}>{moment(point['data']['x'], 'DD.MM.YYYY').format('D MMMM')}</div>
                  <div style={{fontWeight: '700', lineHeight: '24px'}}>
                    {point['data']['y'].toFixed(currentLineChart === 'otkl' ? 2 : 0)}{currentLineChart === 'otkl' && '%'}</div>
                </div>
              )}
            />
          </div>
        </div>
        
        
        <div className="paper tariffs">
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h2 className="si-rating-block-title">Тарифы</h2>
            <div
              className={`abons-in-numbers-date ${dateFieldName === 'abonsNumDate' ? 'abons-in-numbers-date-selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setDateFieldName('abonsNumDate'));
              }}
            >
              <img src={calendarIcon} alt="calendar"/>
              <span>{state.abonsNumDate ? moment(state.abonsNumDate, 'DD.MM.YYYY').format('DD.MM.YYYY') : '-'}</span>
            </div>
          </div>
          <ResponsiveBar
            data={tariffData}
            keys={['value1', 'value2']}
            indexBy="id"
            margin={{top: 50, right: 37, bottom: 50, left: 0}}
            padding={0.7}
            height={313}
            borderRadius={3}
            colors={['#E31A1A', '#1DBF12']}
            borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
            axisTop={null}
            axisLeft={null}
            axisRight={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
            legends={[]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            enableLabel={false}
            tooltip={({data}) => (
              <div className="tariffs-tooltip">
                <div className="tariffs-tooltip-pointer"/>
                <div className="tariffs-tooltip-pie-block">
                  <span className="tariffs-tooltip-title">{data.id}</span>
                  <div className="tariffs-tooltip-pie">
                    <ResponsivePie
                      data={[
                        {id: 'ААБ', value: data.value2},
                        {id: 'НАБ', value: data.value1},
                      ]}
                      height={80}
                      width={170}
                      innerRadius={0.65}
                      colors={['#1DBF12', '#E31A1A',]}
                      borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
                      enableSliceLabels={false}
                      isInteractive={false}
                      enableArcLabels={false}
                      enableArcLinkLabels={false}
                    />
                  </div>
                  <div className="tariffs-tooltip-stats">
                    <div className="tariffs-tooltip-stats-inner">
                      <span>ААБ</span>
                      <span>{Number(((data.value2 || 0) / ((data.value1 + data.value2) || 0) * 100).toFixed(1) || 0)}%</span>
                      <span>{data.value2}</span>
                    </div>
                    <div className="tariffs-tooltip-stats-divider"/>
                    <div className="tariffs-tooltip-stats-inner">
                      <span>НАБ</span>
                      <span>{Number(((data.value1 || 0) / ((data.value1 + data.value2) || 0) * 100).toFixed(1) || 0)}%</span>
                      <span>{data.value1}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;