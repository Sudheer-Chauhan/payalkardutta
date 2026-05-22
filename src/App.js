import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import PayalKarDutta from './Pages/PayalKarDutta_Website 1';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<PayalKarDutta />} /> */}
        {/* <Route path="/" element={<PayalKarDutta1 />} /> */}
        <Route path="/" element={<PayalKarDutta />} />
      </Routes>
    </Router>
  );
}

export default App;