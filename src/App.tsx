// src/App.tsx
// Main app with React Router integration for full Lovable site

import { useEffect } from 'react';
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
import { savePint } from './utils/db';
import './App.css';

function App() {
  // One-time migration from localStorage to IndexedDB
  useEffect(() => {
    const migrateLocalStorageToIndexedDB = async () => {
      try {
        // Check if migration already completed
        const migrationComplete = localStorage.getItem('pintLog_migrated');
        if (migrationComplete === 'true') {
          console.log('✅ Migration already completed');
          return;
        }

        // Check if localStorage has old pintLog data
        const oldPintLog = localStorage.getItem('pintLog');
        if (!oldPintLog) {
          console.log('ℹ️ No old pintLog data to migrate');
          localStorage.setItem('pintLog_migrated', 'true');
          return;
        }

        console.log('🔄 Starting migration from localStorage to IndexedDB...');
        const pintLog = JSON.parse(oldPintLog);

        if (!Array.isArray(pintLog) || pintLog.length === 0) {
          console.log('ℹ️ No pints to migrate');
          localStorage.setItem('pintLog_migrated', 'true');
          return;
        }

        // Migrate each pint to IndexedDB
        let migratedCount = 0;
        for (const pint of pintLog) {
          try {
            // Transform old format to new IndexedDB schema
            await savePint({
              id: pint.id || Date.now() + migratedCount,
              date: pint.date || new Date().toISOString(),
              splitScore: pint.splitScore || 0,
              splitImage: pint.splitImage || '',
              splitDetected: pint.splitDetected ?? false,
              feedback: pint.feedback || '',
              location: pint.location || null,
              ranking: pint.ranking || null,
              overallRating: pint.overallRating || null,
              price: pint.price || null,
              taste: pint.taste || null,
              temperature: pint.temperature || null,
              creaminess: pint.creaminess || null,
              pourTechnique: pint.pourTechnique || null,
            });
            migratedCount++;
          } catch (error) {
            console.error('Failed to migrate pint:', pint.id, error);
          }
        }

        console.log(`✅ Successfully migrated ${migratedCount} pints to IndexedDB`);

        // Mark migration as complete
        localStorage.setItem('pintLog_migrated', 'true');

        // Optionally: Remove old pintLog to free up localStorage space
        // Commented out for safety - can be enabled after testing
        // localStorage.removeItem('pintLog');

      } catch (error) {
        console.error('❌ Migration failed:', error);
      }
    };

    migrateLocalStorageToIndexedDB();
  }, []);

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
