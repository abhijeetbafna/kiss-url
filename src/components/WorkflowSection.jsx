import React from 'react';
import { Layers, Sparkles, Smartphone, BarChart3, ArrowRight } from 'lucide-react';

export default function WorkflowSection({ onOpenCreateModal }) {
  const steps = [
    {
      num: '01',
      title: 'Paste & Shorten Instantly',
      badge: 'Speed',
      desc: 'Enter any long campaign URL, choose your branded domain (kiss.url, go.bio, or custom CNAME), and generate a clean, memorable alias.',
      icon: <Layers size={22} color="var(--color-accent)" />
    },
    {
      num: '02',
      title: 'Attach Smart Edge Rules',
      badge: 'Control',
      desc: 'Customize your OpenGraph social preview card, set mobile app store deep-linking for iOS/Android, and add passcode locks or auto-burn limits.',
      icon: <Sparkles size={22} color="#7c3aed" />
    },
    {
      num: '03',
      title: 'Distribute & Track in Real-Time',
      badge: 'Intelligence',
      desc: 'Download high-res vector QR codes for print/merch, share across social feeds, and inspect live click streams, referrers, and geo heatmaps.',
      icon: <BarChart3 size={22} color="#059669" />
    }
  ];

  return (
    <section 
      id="workflow-section" 
      className="card-surface" 
      style={{ 
        padding: '2.5rem 2rem', 
        marginBottom: '2.5rem',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--color-bg-surface)'
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
            <Layers size={12} /> The Complete Workflow
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            How Modern Teams Manage Links with KissURL
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '560px', marginInline: 'auto' }}>
            From one-off links to high-scale global marketing campaigns in three seamless steps.
          </p>
        </div>

        {/* 3 Step Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              style={{ 
                backgroundColor: 'var(--color-bg-subtle)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border-subtle)', 
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)' }}>
                  {step.icon}
                </div>
                <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text-muted)', opacity: 0.5 }}>
                  {step.num}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                {step.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', flex: 1 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div style={{ 
          backgroundColor: 'var(--color-bg-subtle)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem 1.75rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-text-primary)' }}>
              Ready to create your first smart link?
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              No credit card required. Works instantly in anonymous guest mode.
            </div>
          </div>

          <button onClick={onOpenCreateModal} className="btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
            Open Link Creator Studio <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
