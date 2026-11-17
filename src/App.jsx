import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import StaticsDetail from './components/DetailSection/StaticsDetail/StaticsDetail';
import Library from './components/Sections/Library/Library';
import NotFound from "./components/NotFound/NotFound";
import Elibrary from './components/Elibrary/Elibrary';
import CampusLife from './components/DetailSection/Campus-life/CampusLife';
import StudentLife from './components/DetailSection/StudentLife/StudentLife';
import Almuni from './components/DetailSection/Almuni/Almuni';
import Departments from './components/Departments/Departments';
import Gallary from './components/DetailSection/Gallary/Gallary';


// function NotFound() {
//   return <div style={{ padding: 40 }}>404 - Page not found</div>;
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* every route inside here gets Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/staticsdetail" element={<StaticsDetail />} />
          <Route path="/library" element={<Library/>}/>
          <Route path="/e-learning" element={<Elibrary/>}/>
          <Route path="/campus-life" element={<CampusLife/>}/>
          <Route path="/studentLife" element={<StudentLife/>} />
          <Route path="/alumni" element={<Almuni/>} />
          <Route path="/departments" element={<Departments/>} />
          <Route path='/gallary' element = {<Gallary/>}/>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;