"use client";

import { useEffect } from 'react';
import { SubmitForm } from '@/app/components/SubmitForm';

export default function HomePage() {
  console.log('🚀 HomePage rendering...');
  
  // Enhanced debug check - client side only
  useEffect(() => {
    console.log('📊 CSS variables check:', {
      background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
      foreground: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
      mediaMovie: getComputedStyle(document.documentElement).getPropertyValue('--color-media-movie'),
      card: getComputedStyle(document.documentElement).getPropertyValue('--card'),
    });
    
    // Check if tailwind classes are working
    const testDiv = document.createElement('div');
    testDiv.className = 'text-media-movie';
    document.body.appendChild(testDiv);
    const computedStyle = getComputedStyle(testDiv);
    console.log('🎨 Tailwind test - text-media-movie color:', computedStyle.color);
    document.body.removeChild(testDiv);
  }, []);

  // Modern KATALOG-inspired styles
  const pageStyle = {
    minHeight: '100vh',
    background: `
      linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%),
      radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%)
    `,
    color: '#fafafa',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: '2rem',
    textAlign: 'center' as const,
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '300',
    background: 'linear-gradient(135deg, #fafafa 0%, #a1a1aa 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#a1a1aa',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6'
  };

  const featuresContainerStyle = {
    padding: '0 2rem',
    marginBottom: '4rem'
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const createFeatureCardStyle = (color: string) => ({
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.08) 0%, 
        rgba(255, 255, 255, 0.02) 100%
      )
    `,
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 1px 0 rgba(255, 255, 255, 0.05) inset
    `
  });

  const iconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    display: 'block'
  };

  const featureTitleStyle = (color: string) => ({
    fontSize: '1.25rem',
    fontWeight: '600',
    color: color,
    marginBottom: '0.5rem'
  });

  const featureDescStyle = {
    color: '#a1a1aa',
    fontSize: '0.875rem'
  };

  const mainFormContainerStyle = {
    padding: '0 2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  };

  const formCardStyle = {
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.12) 0%, 
        rgba(255, 255, 255, 0.04) 100%
      )
    `,
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '1.5rem',
    padding: '3rem',
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 1px 0 rgba(255, 255, 255, 0.1) inset
    `,
    position: 'relative' as const
  };

  const footerStyle = {
    marginTop: '4rem',
    padding: '2rem',
    textAlign: 'center' as const,
    color: '#71717a',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  };

  const features = [
    { 
      icon: "📄", 
      title: "PDF & DOCX", 
      desc: "Process any document format", 
      color: "#3b82f6"
    },
    { 
      icon: "🤖", 
      title: "Claude AI", 
      desc: "Advanced AI analysis", 
      color: "#8b5cf6"
    },
    { 
      icon: "📝", 
      title: "Notion", 
      desc: "Automatic page creation", 
      color: "#10b981"
    },
    { 
      icon: "📱", 
      title: "Telegram", 
      desc: "Real-time notifications", 
      color: "#f59e0b"
    }
  ];

  return (
    <div style={pageStyle}>
      {/* Floating background orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>
            Document Analyzer
          </h1>
          <p style={subtitleStyle}>
            Transform your documents with AI-powered analysis. 
            Upload PDFs or DOCX files and get structured insights 
            delivered to Notion and Telegram.
          </p>
        </header>

        {/* Features */}
        <section style={featuresContainerStyle}>
          <div style={featuresGridStyle}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={createFeatureCardStyle(feature.color)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.transform = 'translateY(-5px) scale(1.02)';
                  target.style.background = `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.12) 0%, 
                      rgba(255, 255, 255, 0.06) 100%
                    )
                  `;
                  target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.transform = 'translateY(0) scale(1)';
                  target.style.background = `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.08) 0%, 
                      rgba(255, 255, 255, 0.02) 100%
                    )
                  `;
                  target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <span style={iconStyle}>{feature.icon}</span>
                <h3 style={featureTitleStyle(feature.color)}>{feature.title}</h3>
                <p style={featureDescStyle}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Form */}
        <section style={mainFormContainerStyle}>
          <div style={formCardStyle}>
            <div style={{
              textAlign: 'center' as const,
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '400',
                marginBottom: '1rem',
                color: '#fafafa'
              }}>
                Start Your Analysis
              </h2>
              <p style={{
                color: '#a1a1aa',
                fontSize: '1rem'
              }}>
                Upload your document and get instant AI-powered insights
              </p>
            </div>
            
            <SubmitForm />
          </div>
        </section>

        {/* Footer */}
        <footer style={footerStyle}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap' as const
          }}>
            <span>Powered by Claude AI</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Integrated with Notion</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Real-time Updates</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
} 