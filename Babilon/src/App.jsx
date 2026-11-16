import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import StaticsDetail from './components/DetailSection/StaticsDetail/StaticsDetail';
import Library from './components/Sections/Library/Library';
import NotFound from "./components/NotFound/NotFound";
import Elibrary from './components/Elibrary/Elibrary';


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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;