import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, Sparkles } from 'lucide-react';

export default function QRCodeModal({ link, onClose }) {
  const canvasRef = useRef(null);
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState('H');
  const [copied, setCopied] = useState(false);

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
        className="modal-content" 
        style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-purple">
            <Sparkles size={12} /> Studio QR Generator
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {link.title || link.slug}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <code style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--accent-border)', fontFamily: 'var(--font-mono)' }}>
            {fullUrl}
          </code>
          <button onClick={handleCopyLink} className="btn-ghost" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
            {copied ? <><Check size={13} color="#059669" /> Copied</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>

        {/* Studio View Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '1.5rem', alignItems: 'center' }}>
          {/* Canvas Preview */}
          <div style={{ 
            backgroundColor: bgColor, 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '2px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '210px', height: 'auto', borderRadius: '6px' }} />
          </div>

          {/* Controls */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Brand QR Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center' }}>
                  {['#0f172a', '#2563eb', '#059669', '#d97706', '#db2777', '#7c3aed'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFgColor(color)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: fgColor === color ? '3px solid var(--accent-primary)' : '1px solid var(--border-strong)',
                        cursor: 'pointer',
                        transform: fgColor === color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    aria-label="Custom color picker"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Background
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {['#ffffff', '#f8fafc', '#eff6ff', '#0f172a'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBgColor(color)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: color,
                        border: bgColor === color ? '2px solid var(--accent-primary)' : '1px solid var(--border-strong)',
                        cursor: 'pointer'
                      }}
                      aria-label={`Select background ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Error Correction Level
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {['L', 'M', 'Q', 'H'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setErrorCorrection(lvl)}
                      className={`btn-ghost ${errorCorrection === lvl ? 'badge-indigo' : ''}`}
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.8rem' }}
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
          <button onClick={handleDownloadPNG} className="btn-primary" style={{ flex: 1 }}>
            <Download size={15} /> Download High-Res PNG
          </button>
          <button onClick={handleDownloadSVG} className="btn-secondary" style={{ flex: 1 }}>
            <Download size={15} /> Download Vector SVG
          </button>
        </div>
      </div>
    </div>
  );
}
