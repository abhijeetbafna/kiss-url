import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check } from 'lucide-react';

export default function QRCodeModal({ link, onClose }) {
  const canvasRef = useRef(null);
  const [fgColor, setFgColor] = useState('#09090b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState('H');
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://${link.domain}/${link.slug}`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      fullUrl,
      {
        width: 280,
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
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '540px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              QR Code Generator
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
              <code style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {fullUrl}
              </code>
              <button onClick={handleCopyLink} className="btn-ghost" style={{ padding: '0 4px', fontSize: '0.75rem' }}>
                {copied ? <Check size={12} color="#15803d" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '1.5rem', alignItems: 'center' }}>
            {/* Canvas Preview */}
            <div style={{ 
              backgroundColor: bgColor, 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '180px', height: 'auto', display: 'block' }} />
            </div>

            {/* Customization Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  QR Color
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {['#09090b', '#0070f3', '#15803d', '#b45309', '#7c3aed'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFgColor(color)}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: fgColor === color ? '2px solid var(--text-primary)' : '1px solid var(--border-default)',
                        cursor: 'pointer'
                      }}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    style={{ width: '22px', height: '22px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    aria-label="Custom color picker"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Background
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['#ffffff', '#f4f4f5', '#f0f7ff', '#09090b'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBgColor(color)}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: color,
                        border: bgColor === color ? '2px solid var(--text-primary)' : '1px solid var(--border-default)',
                        cursor: 'pointer'
                      }}
                      aria-label={`Background ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Error Correction Level
                </label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {['L', 'M', 'Q', 'H'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setErrorCorrection(lvl)}
                      className={`btn ${errorCorrection === lvl ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                    >
                      {lvl === 'H' ? 'High' : lvl === 'Q' ? 'Quarter' : lvl === 'M' ? 'Medium' : 'Low'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'flex-end'
        }}>
          <button onClick={handleDownloadPNG} className="btn btn-secondary">
            <Download size={14} /> Download PNG
          </button>
          <button onClick={handleDownloadSVG} className="btn btn-primary">
            <Download size={14} /> Download Vector SVG
          </button>
        </div>
      </div>
    </div>
  );
}
