import React, {useEffect, useState} from 'react';
import mainLogo from '../../assets/dashboard-logo.png';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {signIn} from "../../features/userThunk";
import './signIn.css';

const SignIn = () => {
  const [state, setState] = useState({
    login: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userState.user);
  const authorizationError = useAppSelector(state => state.userState.authorizationError);

  const onChange = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signIn(state));
  };

  useEffect(() => {
    if (
      user ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      /iPad|Android|tablet|touch/i.test(navigator.userAgent)
    ) navigate('/bonuses');
  }, [navigate, user]);
  
  useEffect(() => {
    if (user) navigate('/statistics');
  }, [navigate, user]);

  return (
    <div className="form-container">
      <img src={mainLogo} alt="Skynet"/>
      <form onSubmit={onSubmit}>
        <input name='login' value={state.login} type="text" placeholder="Логин" onChange={onChange} required/>
        <input
          name='password' value={state.password} type="password" placeholder="Пароль"
          onChange={onChange} required
        />
        <button type="submit" className="form-submit-btn">Войти</button>
        {authorizationError && <span className="form-container-helper">{authorizationError}</span>}
      </form>
    </div>
  );
};

export default SignIn;