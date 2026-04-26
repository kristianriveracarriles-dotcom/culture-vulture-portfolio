import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import PortfolioGrid from './components/PortfolioGrid';
import WheelspinEngine from './projects/wheelspin/WheelspinEngine';
import './styles/index.css';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ 
                clipPath: [
                    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)'
                ] 
            }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
        >
            {children}
        </motion.div>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                    <PageWrapper>
                        <main>
                            <PortfolioGrid />
                        </main>
                    </PageWrapper>
                } />
                <Route path="/wheelspin" element={
                    <PageWrapper>
                        <main className="case-study-hero">
                            <WheelspinEngine />
                        </main>
                    </PageWrapper>
                } />
                {/* Fallback for other projects */}
                <Route path="/:id" element={
                    <PageWrapper>
                        <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h1 className="reg-error" data-text="COMING SOON">COMING SOON</h1>
                        </main>
                    </PageWrapper>
                } />
            </Routes>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <AnimatedRoutes />
        </Router>
    );
};

export default App;
