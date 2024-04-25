import {Route, Routes} from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Dashboard from "./containers/Dashboard/Dashboard";
import {useEffect} from "react";
import {useAppDispatch} from "./app/hooks";
import moment from "moment";
import 'moment/locale/ru';
import {setDropdown} from "./features/dataSlice";
import './App.css';

moment.locale('ru');

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener('click', () => {
      dispatch(setDropdown(''));
    });
  }, [dispatch]);

  return (
    <div className="App">
      <Menu/>
      <Routes>
        <Route path='*' element={<Dashboard/>}/>
      </Routes>
    </div>
  );
};

export default App;
