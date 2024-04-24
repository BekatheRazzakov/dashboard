import './App.css';
import {Route, Routes} from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Dashboard from "./containers/Dashboard/Dashboard";

const App = () => {
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
