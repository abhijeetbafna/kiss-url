import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, Sparkles, Sliders, Share2 } from 'lucide-react';

export default function QRCodeModal({ link, onClose }) {
  const canvasRef = useRef(null);
  const [fgColor, setFgColor] = useState('#6366f1');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [errorCorrection, setErrorCorrection] = useState('H');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('style');

  const fullUrl = `https://${link.domain}/${link.slug}`;

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      fullUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      },
      (error) => {
        if (error) console.error('QR Code render error:', error);
      }
    );
  }, [fullUrl, fgColor, bgColor, errorCorrection]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr_${link.slug}.png`;
    a.click();
  };

  const handleDownloadSVG = async () => {
    try {
      const svgString = await QRCode.toString(fullUrl, {
        type: 'svg',
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorCorrection,
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_${link.slug}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-purple">
            <Sparkles size={12} /> Studio QR Generator
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          {link.title || link.slug}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-cyan)' }}>
            {fullUrl}
          </code>
          <button onClick={handleCopyLink} className="btn-ghost" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
            {copied ? <><Check size={13} color="#10b981" /> Copied</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>

        {/* Studio View Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '1.5rem', alignItems: 'center' }}>
          {/* Canvas Preview Container */}
          <div style={{ 
            background: bgColor, 
            padding: '1rem', 
            borderRadius: '16px', 
            border: '2px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 10px 30px ${fgColor}22`
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '220px', height: 'auto', borderRadius: '8px' }} />
          </div>

          {/* Customization Controls */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Brand Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center' }}>
                  {['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ffffff'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFgColor(color)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: color,
                        border: fgColor === color ? '3px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        transform: fgColor === color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s'
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Background
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {['#0f172a', '#000000', '#1e1b4b', '#064e3b', '#ffffff'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBgColor(color)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: color,
                        border: bgColor === color ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Error Correction Level
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {['L', 'M', 'Q', 'H'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setErrorCorrection(lvl)}
                      className={`btn-ghost ${errorCorrection === lvl ? 'badge-indigo' : ''}`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      {lvl === 'H' ? 'High (30%)' : lvl === 'Q' ? 'Quartile (25%)' : lvl === 'M' ? 'Medium' : 'Low'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <button onClick={handleDownloadPNG} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Download size={16} /> Download High-Res PNG
          </button>
          <button onClick={handleDownloadSVG} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <Download size={16} /> Download Vector SVG
          </button>
        </div>
      </div>
    </div>
  );
}
