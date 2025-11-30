// src/App.tsx
// Main app with React Router integration for full Lovable site

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GSplit from './pages/GSplit';
import GSplitResult from './pages/GSplitResult';
import GSplitResultV2 from './pages/GSplitResultV2';
import PintSurvey from './pages/PintSurvey';
import Results from './pages/Results';
import PintLog from './pages/PintLog';
import Pintlog2 from './pages/Pintlog2';
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
          <Route path="/split-result-v2" element={<GSplitResultV2 />} />
          <Route path="/survey" element={<PintSurvey />} />
          <Route path="/results" element={<Results />} />
          <Route path="/log" element={<Pintlog2 />} />
          <Route path="/log-old" element={<PintLog />} />
          <Route path="/map" element={<Map />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
