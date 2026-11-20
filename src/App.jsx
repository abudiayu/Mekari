import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import StaticsDetail from './components/DetailSection/StaticsDetail/StaticsDetail';
import Library from './components/Sections/Library/Library';
import NotFound from './components/NotFound/NotFound';
import Elibrary from './components/Elibrary/Elibrary';
import CampusLife from './components/DetailSection/Campus-life/CampusLife';
import StudentLife from './components/DetailSection/StudentLife/StudentLife';
import Almuni from './components/DetailSection/Almuni/Almuni';
import Departments from './components/Departments/Departments';
import Gallary from './components/DetailSection/Gallary/Gallary';
import Auth from './pages/Auth/Auth';
import News from './pages/News/News';
import Events from './ListNavebars/Events/Events';
import Loding from './components/Loding/Loding';
import About from './pages/About/About';
import MissionVision from './components/Mission/MissionVision';
import Leadership from './components/Leaderships/Leadership';
import Contact from "./components/Contact/Contact";
import Scholarships from './pages/Scholarships/Scholarships';
import Kombolcha from './components/Academy/Kombolicha/Kombolicha';
import Dessie from './components/Academy/Dessie/Dessie.jsx';
import Tita from './components/Academy/Tita/Tita.jsx';
import ResearchGroup from './components/Research/ResearchGroup/ResearchGroup.jsx';

function App() {
  const [loading, setLoading] = useState(true);
  const handleFinish = useCallback(() => setLoading(false), []);

  return (
    <>

      {loading && (
        <Loding
          minDuration={import.meta.env.DEV ? 300 : 600}
          waitForLoad={!import.meta.env.DEV}
          onFinish={handleFinish}
        />
      )}

      <BrowserRouter>
        <Routes>
          {/* every route inside here gets Navbar + Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/staticsdetail" element={<StaticsDetail />} />
            <Route path="/library" element={<Library />} />
            <Route path="/e-learning" element={<Elibrary />} />
            <Route path="/campus-life" element={<CampusLife />} />
            <Route path="/studentLife" element={<StudentLife />} />
            <Route path="/alumni" element={<Almuni />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/gallary" element={<Gallary />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/news" element={<News />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path='/mission' element={<MissionVision/>}/>
            <Route path='/leader' element={<Leadership/>}/>
            <Route path= "/contact" element= {<Contact/>}/>
            <Route path='/scholarship' element= {<Scholarships/>}/>
            <Route path='/kiot' element= {<Kombolcha/>}/>
            <Route path="/dessie" element={<Dessie/>}/>
            <Route path="/tita" element={<Tita/>}/>
            <Route path="/researchgroup" element={<ResearchGroup/>}/>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;