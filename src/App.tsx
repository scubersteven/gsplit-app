// src/App.tsx
// Main app with React Router integration for full Lovable site

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GSplit from './pages/GSplit';
import GSplitResult from './pages/GSplitResult';
import PintSurvey from './pages/PintSurvey';
import Results from './pages/Results';
import PintLog from './pages/PintLog';
import Map from './pages/Map';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/split" element={<GSplit />} />
          <Route path="/split-result" element={<GSplitResult />} />
          <Route path="/survey" element={<PintSurvey />} />
          <Route path="/results" element={<Results />} />
          <Route path="/log" element={<PintLog />} />
          <Route path="/map" element={<Map />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
