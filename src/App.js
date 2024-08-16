
import "./App.css";
import Home from "./Home"
import {Routes,Route, Navigate} from 'react-router-dom'
import Error from './Error';
import Single from './Single';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:id" element={<Single />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
