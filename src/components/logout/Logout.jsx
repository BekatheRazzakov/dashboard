import React from 'react';
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/usersSlice";
import { useNavigate } from "react-router-dom";
import './logout.css';

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  return (
    <button
      type='button' className="logout-btn"
      onClick={() => {
        dispatch(logout());
        navigate('/sign-in');
      }}
    >
      <div className="logout-btn-icon"/>
      Выйти
    </button>
  );
};

export default Logout;