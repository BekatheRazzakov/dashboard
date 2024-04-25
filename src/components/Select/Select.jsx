import React from 'react';
import {ReactComponent as ArrowDown} from "../../assets/arrow-down.svg";
import './select.css';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setDropdown} from "../../features/dataSlice";

const Select = ({name, value, options, changeHandler, style}) => {
  const dispatch = useAppDispatch();
  const currentDropdown = useAppSelector(state => state.dataState.currentDropDown);

  return (
    <div
      className={`select ${currentDropdown === name ? 'select-open' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setDropdown(name));
      }}
      style={style}
    >
      <div className="select-current-option">
        {value}<ArrowDown/>
      </div>
      <div className="select-options">
        {
          options.filter(option => option !== (value || '')).map(option => (
            <span
              className="select-option"
              key={option}
              onClick={() => {
                changeHandler(option);
                setTimeout(() => dispatch(setDropdown('')), 10);
              }}>{option}</span>
          ))
        }
      </div>
    </div>
  );
};

export default Select;