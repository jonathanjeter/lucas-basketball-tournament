import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Import pages
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { AdminPage } from './pages/AdminPage';
import { BracketsPage } from './pages/BracketsPage';
import { ContactPage } from './pages/ContactPage';
import { ProjectPage } from './pages/ProjectPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { DonationPolicyPage } from './pages/DonationPolicyPage';
import { LiabilityWaiverPage } from './pages/LiabilityWaiverPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/brackets" element={<BracketsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/project" element={<ProjectPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/donation-policy" element={<DonationPolicyPage />} />
            <Route path="/liability-waiver" element={<LiabilityWaiverPage />} />
          </Routes>
        </main>
        
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;