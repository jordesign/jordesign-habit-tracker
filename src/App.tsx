import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route path="/habits" element={<div>Habits</div>} />
          <Route path="/metrics" element={<div>Metrics</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App; 