import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import './styles/index.css';

// Lazy load route components to reduce initial bundle size and delay loading heavy dependencies (like @rive-app/react-webgl2)
const PortfolioGrid = lazy(() => import('./components/PortfolioGrid'));
const WheelspinEngine = lazy(() => import('./projects/wheelspin/WheelspinEngine'));

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
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--color-accent)' }}>LOADING...</div>}>
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
        </Suspense>
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
