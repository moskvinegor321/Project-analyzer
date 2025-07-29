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

  // Force styles as backup with !important
  const forceStyles = {
    backgroundColor: 'hsl(0, 0%, 6.7%) !important',
    color: 'hsl(0, 0%, 98%) !important',
    minHeight: '100vh !important'
  };

  const headerStyle = {
    backgroundColor: 'hsl(217, 91%, 60%) !important',
    color: 'white !important',
    padding: '1rem !important',
    borderRadius: '0.5rem !important',
    marginBottom: '2rem !important'
  };

  return (
    <div 
      className="min-h-screen content-gradient"
      style={{
        backgroundColor: 'hsl(0, 0%, 6.7%)',
        color: 'hsl(0, 0%, 98%)',
        minHeight: '100vh',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
      }}
    >
      {/* DEBUG HEADER */}
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          🎨 KATALOG Design System Applied - CSS Working!
        </h1>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl bg-gradient-to-r from-media-movie to-transparent"
          style={{
            background: 'radial-gradient(circle, hsl(217, 91%, 60%) 0%, transparent 70%)',
            width: '24rem',
            height: '24rem',
            borderRadius: '50%',
            filter: 'blur(3rem)',
            opacity: 0.2
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-media-tv to-transparent"
          style={{
            background: 'radial-gradient(circle, hsl(271, 91%, 65%) 0%, transparent 70%)',
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
            filter: 'blur(3rem)',
            opacity: 0.15
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative">
        {/* Header */}
        <header className="px-8 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 
                  className="text-2xl font-bold text-foreground"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'hsl(0, 0%, 98%)',
                    fontFamily: 'var(--font-spectral, serif)',
                    background: 'linear-gradient(135deg, hsl(0, 0%, 98%) 0%, hsl(0, 0%, 63.9%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Document Analyzer
                </h1>
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/30 backdrop-blur-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    padding: '0.5rem 1rem',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <span 
                    className="inline-block w-2 h-2 bg-status-success rounded-full animate-pulse"
                    style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: 'hsl(142, 71%, 45%)',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <span 
                    className="font-heading-xs text-muted-foreground"
                    style={{
                      fontSize: '0.75rem',
                      color: 'hsl(0, 0%, 63.9%)',
                      fontWeight: '500'
                    }}
                  >
                    AI-Powered Analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section className="px-8 pt-12 pb-16">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main title */}
            <div className="space-y-6 mb-12">
              <h2 
                className="font-heading-display text-foreground leading-tight"
                style={{
                  fontSize: 'clamp(3.75rem, 2.625rem + 3.515625vw, 7.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.04em',
                  fontFamily: 'serif',
                  fontWeight: '300',
                  color: 'hsl(0, 0%, 98%)'
                }}
              >
                Analyze Documents
                <br />
                <span 
                  className="text-muted-foreground"
                  style={{ color: 'hsl(0, 0%, 63.9%)' }}
                >
                  with AI Precision
                </span>
              </h2>
              
              <p 
                className="font-heading text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  color: 'hsl(0, 0%, 63.9%)',
                  maxWidth: '48rem',
                  margin: '0 auto'
                }}
              >
                Upload your PDF or DOCX documents and get detailed AI-powered analysis 
                with structured insights, sent directly to Notion and Telegram.
              </p>
            </div>
            
            {/* Feature showcase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  icon: "📄", 
                  label: "PDF & DOCX", 
                  desc: "Support", 
                  color: "hsl(217, 91%, 60%)",
                  detail: "Process any document format"
                },
                { 
                  icon: "🤖", 
                  label: "Claude AI", 
                  desc: "Analysis", 
                  color: "hsl(271, 91%, 65%)",
                  detail: "Advanced AI understanding"
                },
                { 
                  icon: "📝", 
                  label: "Notion", 
                  desc: "Integration", 
                  color: "hsl(173, 80%, 40%)",
                  detail: "Automatic page creation"
                },
                { 
                  icon: "📱", 
                  label: "Telegram", 
                  desc: "Notifications", 
                  color: "hsl(38, 92%, 50%)",
                  detail: "Real-time updates"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  style={{ transition: 'all 0.3s ease' }}
                >
                  <div 
                    className="relative p-6 rounded-2xl bg-card/30 border border-border/20 backdrop-blur-sm hover:bg-card/50 hover:border-border/40 transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      backdropFilter: 'blur(12px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {/* Feature icon */}
                    <div 
                      className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {feature.icon}
                    </div>
                    
                    {/* Feature content */}
                    <div className="text-center space-y-2">
                      <div 
                        className="font-heading"
                        style={{ 
                          color: feature.color,
                          fontWeight: '600',
                          fontSize: '1.125rem'
                        }}
                      >
                        {feature.label}
                      </div>
                      <div 
                        className="font-heading-xs text-muted-foreground"
                        style={{ 
                          color: 'hsl(0, 0%, 63.9%)',
                          fontSize: '0.875rem'
                        }}
                      >
                        {feature.desc}
                      </div>
                      <div 
                        className="font-heading-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          color: 'hsl(0, 0%, 40%)',
                          fontSize: '0.75rem',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        {feature.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main application section */}
        <section className="px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12">
              <h3 
                className="font-heading-2xl text-foreground mb-4"
                style={{
                  fontSize: 'clamp(2.125rem, 1.625rem + 1.5625vw, 3.25rem)',
                  fontWeight: '300',
                  color: 'hsl(0, 0%, 98%)',
                  marginBottom: '1rem'
                }}
              >
                Start Your Analysis
              </h3>
              <p 
                className="font-heading text-muted-foreground max-w-2xl mx-auto"
                style={{
                  fontSize: '1.125rem',
                  color: 'hsl(0, 0%, 63.9%)',
                  maxWidth: '32rem',
                  margin: '0 auto'
                }}
              >
                Upload your document and provide any additional context to get the most accurate AI analysis
              </p>
            </div>

            {/* Application form */}
            <div className="relative">
              {/* Main container */}
              <div 
                className="relative bg-card/40 border border-border/30 rounded-3xl p-8 md:p-12 backdrop-blur-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '1.5rem',
                  padding: '3rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <SubmitForm />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <div 
              className="bg-card/20 border border-border/20 rounded-2xl p-6 text-center backdrop-blur-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div 
                className="flex items-center justify-center space-x-8 font-heading-xs text-muted-foreground/60"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2rem',
                  fontSize: '0.875rem',
                  color: 'hsl(0, 0%, 40%)'
                }}
              >
                <span>Powered by Claude AI</span>
                <div 
                  className="w-1 h-1 bg-muted-foreground/30 rounded-full"
                  style={{
                    width: '0.25rem',
                    height: '0.25rem',
                    backgroundColor: 'hsl(0, 0%, 30%)',
                    borderRadius: '50%'
                  }}
                />
                <span>Integrated with Notion</span>
                <div 
                  className="w-1 h-1 bg-muted-foreground/30 rounded-full"
                  style={{
                    width: '0.25rem',
                    height: '0.25rem',
                    backgroundColor: 'hsl(0, 0%, 30%)',
                    borderRadius: '50%'
                  }}
                />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 