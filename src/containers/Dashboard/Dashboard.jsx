import React, { useEffect, useState, memo } from 'react';
import DatePicker from "../../components/DatePicker/DatePicker";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import moment from "moment";
import { setDateFieldName } from "../../features/dataSlice";
import { fetchAbonsData, fetchAbonsDataArray, fetchRating, fetchTariffs } from "../../features/dataThunk";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar';
import calendarIcon from '../../assets/calendar.svg';
import defaultAvatar from '../../assets/default-avatar.png';
import CoverLoader from "../../components/CoverLoader/CoverLoader";
import './dashboard.css';

const Dashboard = ({style, title, regions, onDateChange}) => {
  const dispatch = useAppDispatch();
  const dateFieldName = useAppSelector(state => state.dataState.dateFieldName);
  const abonsData = useAppSelector(state => state.dataState.abonsData);
  const currentSquare = useAppSelector(state => state.dataState.currentSquare);
  const abonsDataArray = useAppSelector(state => state.dataState.abonsDataArray);
  const fetchAbonsLoading = useAppSelector(state => state.dataState.fetchAbonsLoading);
  const abonsDataArrayLoading = useAppSelector(state => state.dataState.abonsDataArrayLoading);
  const fetchRatingLoading = useAppSelector(state => state.dataState.fetchRatingLoading);
  const tariffsLoading = useAppSelector(state => state.dataState.tariffsLoading);
  const siRating = useAppSelector(state => state.dataState.rating);
  const tariffData = useAppSelector(state => state.dataState.tariffs);
  const [state, setState] = useState({
    periodDate1: moment().subtract(7, 'days').format('DD.MM.YYYY'),
    periodDate2: moment().subtract(1, 'days').format('DD.MM.YYYY'),
    abonsNumDate: moment().subtract(1, 'days').format('DD.MM.YYYY'),
  });
  const [currentTariff, setCurrentTariff] = useState({
    tariffName: '',
    aab: 0,
    nab: 0,
    x: 0,
    y: 0,
  });
  const [showCurrentTariff, setShowCurrentTariff] = useState(false);
  const [siSortBy, setSiSortBy] = useState('podkl');
  const [currentLineChart, setCurrentLineChart] = useState('aab');
  const aabPercentage = Number(((abonsData.aab || 0) / (abonsData.oab || 0) * 100).toFixed(2)) || 0;
  const nabPercentage = Number(((abonsData.nab || 0) / (abonsData.oab || 0) * 100).toFixed(2)) || 0;
  const otkloneniePercentage = Number((aabPercentage - 90).toFixed(2)) || 0;
  const otklonenieKolvo = Number((((abonsData.oab || 0) / 100 * 90) / 100 * otkloneniePercentage).toFixed()) || 0;
  const minY = Math.min(...[(abonsDataArray || [])[currentLineChart === 'aab' ? 0 : currentLineChart === 'nab' ? 1 : currentLineChart === 'otkl' ? 2 : 0]].flatMap(series => series?.data.map(d => parseInt(d.y))));
  const maxY = Math.max(...[(abonsDataArray || [])[currentLineChart === 'aab' ? 0 : currentLineChart === 'nab' ? 1 : currentLineChart === 'otkl' ? 2 : 0]].flatMap(series => series?.data.map(d => parseInt(d.y))));
  const tickStep = currentLineChart === 'aab' ? 200 : currentLineChart === 'nab' ? 50 : currentLineChart === 'otkl' ? 4 : 0;
  const tickValues = Array.from({length: Math.ceil((maxY - minY) / tickStep) + 1}, (_, index) => minY + index * tickStep);
  
  const changeHandler = (value) => {
    if (fetchAbonsLoading || abonsDataArrayLoading || fetchRatingLoading || tariffsLoading) return;
    if (dateFieldName === 'periodDate1') {
      if (!state.periodDate1) {
        setState(prevState => ({
          ...prevState, periodDate1: value, date2: '',
        }));
      } else if (state.periodDate1 && !state.periodDate2) {
        if (moment(value, 'DD.MM.YYYY').isBefore(moment(state.periodDate1, 'DD.MM.YYYY'))) {
          setState(prevState => ({
            ...prevState, periodDate1: value, periodDate2: state.periodDate1,
          }));
        } else {
          setState(prevState => ({
            ...prevState, periodDate2: value,
          }));
        }
      } else if (state.periodDate1 && state.periodDate2) {
        setState(prevState => ({
          ...prevState, periodDate1: value, periodDate2: '',
        }));
      }
    } else if (dateFieldName === 'abonsNumDate') {
      setState(prevState => ({
        ...prevState, abonsNumDate: value,
      }));
    }
  };
  
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  useEffect(() => {
    const getData = async () => {
      const reformatDate = moment(state.abonsNumDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
      if (regions) {
        onDateChange(reformatDate);
      }
      dispatch(fetchAbonsData({date: reformatDate, square: currentSquare?.id}));
      dispatch(fetchTariffs({date: reformatDate, square: currentSquare?.id}));
      dispatch(fetchRating({date: reformatDate, square: currentSquare?.id}));
    };
    void getData();
    // no more dependencies needed
  }, [currentSquare?.id, dispatch, regions, state.abonsNumDate]);
  
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
  
  const TariffsPopup = memo(() => {
    return (
      <div className="tariffs-tooltip"
           style={{
             transform: `translate(-50%, -110%)`,
             position: 'fixed',
             top: currentTariff.y + 'px',
             left: currentTariff.x + 'px',
             zIndex: '1'
           }}
      >
        <div className="tariffs-tooltip-pointer"/>
        <div className="tariffs-tooltip-pie-block">
          <span className="tariffs-tooltip-title">{currentTariff.tariffName}</span>
          <div className="tariffs-tooltip-pie">
            <ResponsivePie
              data={[{id: 'ААБ', value: currentTariff.aab}, {id: 'НАБ', value: currentTariff.nab},]}
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
              <span>{Number(((currentTariff.aab || 0) / ((currentTariff.nab + currentTariff.aab) || 0) * 100).toFixed(1) || 0)}%</span>
              <span>{currentTariff.aab}</span>
            </div>
            <div className="tariffs-tooltip-stats-divider"/>
            <div className="tariffs-tooltip-stats-inner">
              <span>НАБ</span>
              <span>{Number(((currentTariff.nab || 0) / ((currentTariff.nab + currentTariff.aab) || 0) * 100).toFixed(1) || 0)}%</span>
              <span>{currentTariff.nab}</span>
            </div>
          </div>
        </div>
      </div>
    );
  });
  
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
          {fetchAbonsLoading && <CoverLoader/>}
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
            date1={dateFieldName === 'periodDate1' ? state.periodDate1 : dateFieldName === 'abonsNumDate' ? state.abonsNumDate : ''}
            date2={dateFieldName === 'periodDate1' ? state.periodDate2 : ''}
            changeHandler={changeHandler}
          />
        </div>
        
        
        <div className="paper percentage">
          {fetchAbonsLoading && <CoverLoader/>}
          <span className="percentage-title">Проценты</span>
          <ResponsivePie
            data={[{
              "id": "ААБ", "label": "ААБ", "value": abonsData.aab,
            }, {
              "id": "НАБ", "label": "НАБ", "value": abonsData.nab,
            },]}
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
          {fetchRatingLoading && <CoverLoader/>}
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
            {!!siRating.length && siRating.slice(0, siRating.length).sort((a, b) => parseInt(b[siSortBy]) - parseInt(a[siSortBy]))
            .map(si => (<div className="si-rating-staff-item">
              <div style={{display: 'flex', gap: '9px', alignItems: 'center', flexGrow: 1, maxWidth: '210px'}}>
                <img src={defaultAvatar} alt="Сервис инженер"/>
                <span className="si-rating-staff-item-name">{si.name}</span>
              </div>
              <span className="si-rating-staff-item-number">{si.podkl}</span>
              <span className="si-rating-staff-item-number">{si.tp}</span>
              <span className="si-rating-staff-item-number">{si.dem}</span>
            </div>))}
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
              {abonsDataArray[0].data.length ? abonsDataArray[0].data[abonsDataArray[0].data.length - 1]?.y + abonsDataArray[1].data[abonsDataArray[0].data.length - 1]?.y : 0}
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
              data={!!abonsDataArray[0]['data'].length && currentLineChart === 'aab' ? [abonsDataArray[0]] : currentLineChart === 'nab' ? [abonsDataArray[1]] : currentLineChart === 'otkl' ? [abonsDataArray[2]] : []}
              colors={[currentLineChart === 'aab' ? ['#1DBF12'] : currentLineChart === 'nab' ? ['#E31A1A'] : currentLineChart === 'otkl' ? ['#4318FF'] : []]}
              motionConfig="gentle"
              margin={{top: 30, right: 45, bottom: 30, left: 0}}
              curve="catmullRom"
              enableCrosshair={false}
              crosshairType="bottom-right"
              axisTop={null}
              axisRight={{
                tickSize: 5, tickPadding: 8, tickRotation: 0,
              }}
              axisBottom={null}
              axisLeft={null}
              lineWidth={3}
              pointBorderWidth={2}
              pointSize={8}
              enableTouchCrosshair={true}
              useMesh={true}
              yScale={{
                type: 'linear', min: 'auto', max: tickValues[tickValues.length - 1], stacked: false, reverse: false
              }}
              yFormat={value => (value < minY ? null : value)}
              tooltip={({point}) => (<div
                className="responsive-line-tooltip"
                style={{
                  background: point.color
                }}
              >
                <span className="responsive-line-tooltip-pointer" style={{borderTop: `6px solid ${point['color']}`}}/>
                <div style={{
                  fontSize: '12px', opacity: '0.7'
                }}>{moment(point['data']['x'], 'DD.MM.YYYY').format('D MMMM')}</div>
                <div style={{fontWeight: '700', lineHeight: '24px'}}>
                  {point['data']['y'].toFixed(currentLineChart === 'otkl' ? 2 : 0)}{currentLineChart === 'otkl' && '%'}</div>
              </div>)}
            />
          </div>
        </div>
        
        
        <div className="paper tariffs" onMouseMove={() => setShowCurrentTariff(false)}>
          {tariffsLoading && <CoverLoader/>}
          {
            showCurrentTariff &&
            <TariffsPopup tariffName={currentTariff.tariffName}/>
          }
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
            keys={['nab', 'aab']}
            indexBy="tariffName"
            margin={{top: 20, right: 37, bottom: 80, left: 0}}
            padding={0.3}
            height={313}
            borderRadius={3}
            colors={['#E31A1A', '#1DBF12']}
            borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
            axisTop={null}
            axisLeft={null}
            axisRight={{
              tickSize: 5, tickPadding: 5, tickRotation: 0,
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              renderTick: (tick) => (
                <g transform={`translate(${tick.x},${tick.y + 10}), rotate(30)`}>
                  <line x1="0" x2="0" y1="0" y2="5"></line>
                  <text
                    style={{fontSize: '10px'}}
                    textAnchor="left"
                    tariffName={tick.value}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setShowCurrentTariff(true);
                    }}
                    onMouseMove={(e) => {
                      e.stopPropagation();
                      const newTariff = tariffData.filter(tariff => tariff.tariffName === e.target.getAttribute('tariffName'))[0];
                      setCurrentTariff(prevState => ({
                        ...prevState,
                        tariffName: newTariff?.tariffName,
                        aab: newTariff?.aab,
                        nab: newTariff?.nab,
                        x: e.clientX,
                        y: e.clientY,
                      }));
                    }}
                  >{tick.value}</text>
                </g>
              ),
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
            legends={[]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            enableLabel={false}
            tooltip={() => (<></>)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;