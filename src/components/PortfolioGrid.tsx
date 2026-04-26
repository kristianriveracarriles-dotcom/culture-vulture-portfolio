import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectBandProps {
    id: string;
    title: string;
    tag: string;
    subtitle: string;
    videoSrc: string;
    className: string;
}

const ProjectBand: React.FC<ProjectBandProps> = ({ id, title, tag, subtitle, videoSrc, className }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleClick = () => {
        // Here we can trigger a transition effect if we want
        navigate(`/${id}`);
    };

    return (
        <section 
            className={`project-band ${className}`} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <video 
                ref={videoRef}
                className="project-media" 
                src={videoSrc} 
                muted 
                loop 
            />
            <div className="project-content">
                <p className="productions-tag">{tag}</p>
                <h2 className="project-title reg-error" data-text={title}>{title}</h2>
                <p>{subtitle}</p>
            </div>
        </section>
    );
};

const PortfolioGrid: React.FC = () => {
    return (
        <div className="portfolio-grid">
            <ProjectBand 
                id="wheelspin"
                title="WHEELSPIN"
                tag="PROJECT 01"
                subtitle="Aggressive Motion Architecture"
                videoSrc="https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-and-dynamic-texture-2357-large.mp4"
                className="project-band--wheelspin"
            />
            <ProjectBand 
                id="card"
                title="CARDS"
                tag="PROJECT 02"
                subtitle="Digital Collectible Fragments"
                videoSrc="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-abstract-forms-9118-large.mp4"
                className="project-band--card"
            />
            <ProjectBand 
                id="jackpot"
                title="JACKPOT"
                tag="FEATURED_03"
                subtitle="High-Impact Visual Destruction"
                videoSrc="https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-white-triangular-frames-32607-large.mp4"
                className="project-band--jackpot"
            />
        </div>
    );
};

export default PortfolioGrid;
