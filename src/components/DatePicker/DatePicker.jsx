import React, {useState} from 'react';
import moment from "moment";
import Select from "../Select/Select";
import './datePicker.css';

const DatePicker = ({date1, date2, changeHandler}) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const calendar = [];

  const startDay = currentDate.clone().startOf('month').startOf('week');
  const endDay = currentDate.clone().endOf('month').endOf('week');
  const day = startDay.clone();

  while (!day.isAfter(endDay)) {
    calendar.push(day.clone());
    day.add(1, 'day');
  }

  const currentMonthName = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  const updateYear = (newYear) => {
    setCurrentDate(currentDate.clone().year(newYear));
  };

  const updateMonth = (newMonth) => {
    setCurrentDate(currentDate.clone().month(newMonth));
  };

  return (
    <div className="date-picker">
      <div style={{display: 'flex', justifyContent: "center", gap: '17px'}}>
        <Select options={moment.months()} value={currentMonthName} name="month" changeHandler={updateMonth}
                style={{minWidth: '125px'}}/>
        <Select options={['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']} value={currentYear}
                name="year" changeHandler={updateYear} style={{minWidth: '80px'}}/>
      </div>
      <div className="week-names">
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>
      <div className="month-days">
        {
          calendar.map((day, i) => (
            <div
              className={
                `month-day ${
                  date1 === day.format('DD.MM.YYYY') ||
                  date2 === day.format('DD.MM.YYYY') ? 'month-day-selected' : ''
                } ${(() => {
                  if (date1 && date2 && moment(date1, 'DD.MM.YYYY').isSame(day)) {
                    if (moment(date1, 'DD.MM.YYYY').isBefore(moment(date2, 'DD.MM.YYYY'))) {
                      return 'month-day-look-forward';
                    }
                    if (moment(date1, 'DD.MM.YYYY').isAfter(moment(date2, 'DD.MM.YYYY'))) {
                      return 'month-day-look-backwards';
                    }
                  }
                  if (date1 && date2 && moment(date2, 'DD.MM.YYYY').isSame(day)) {
                    if (moment(date1, 'DD.MM.YYYY').isBefore(moment(date2, 'DD.MM.YYYY'))) {
                      return 'month-day-look-backwards';
                    }
                    if (moment(date1, 'DD.MM.YYYY').isAfter(moment(date2, 'DD.MM.YYYY'))) {
                      return 'month-day-look-forward';
                    }
                  }
                  if (
                    date1 && date2 &&
                    ((day.isBefore(moment(date1, 'DD.MM.YYYY')) && day.isAfter(moment(date2, 'DD.MM.YYYY'))) ||
                      (day.isBefore(moment(date2, 'DD.MM.YYYY')) && day.isAfter(moment(date1, 'DD.MM.YYYY'))))
                  ) {
                    return 'month-day-is-between';
                  }
                  if (day.format('MMMM') !== currentMonthName) {
                    return 'month-day-not-current-month';
                  }
                  if (day.format('DD.MM.YYYY') === moment().format('DD.MM.YYYY')) {
                    return 'month-day-is-today';
                  }
                })()}`
              }
              key={i}
              onClick={() => {
                if (day.isBefore(moment()) && !day.isSame(moment(), 'day')) changeHandler(day.format('DD.MM.YYYY'));
              }}
            >
              <div className="month-day-inner">{day.format('D')}</div>
              <div className="month-day-bg-lighter"/>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default DatePicker;