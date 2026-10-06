import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, Pipette, Image as ImageIcon, Zap, Globe } from 'lucide-react';
import { buildShortUrl } from '../services/storageService';

const PRESET_COLORS = ['#09090b', '#ffffff', '#0070f3', '#15803d', '#b45309', '#7c3aed', '#db2777'];
const PRESET_BGS = ['#ffffff', '#f4f4f5', '#eff6ff', '#09090b'];

const CENTER_ICONS = [
  { id: 'none', label: 'None' },
  { id: 'zap', label: '⚡ Zap' },
  { id: 'github', label: 'GitHub' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'globe', label: '🌐 Web' }
];

export default function QRCodeModal({ link, onClose }) {
  const colorInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [fgColor, setFgColor] = useState('#09090b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState('H');
  const [centerIcon, setCenterIcon] = useState('none');
  const [copied, setCopied] = useState(false);

  const fullUrl = buildShortUrl(link.slug, link.domain);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Smart contrast auto-switching
  const handleBgChange = (newBg) => {
    setBgColor(newBg);
    if (newBg === '#09090b' && fgColor === '#09090b') {
      setFgColor('#ffffff');
    } else if (newBg !== '#09090b' && fgColor === '#ffffff') {
      setFgColor('#09090b');
    }
  };

  const handleFgChange = (newFg) => {
    setFgColor(newFg);
    if (newFg === '#09090b' && bgColor === '#09090b') {
      setBgColor('#ffffff');
    } else if (newFg === '#ffffff' && bgColor === '#ffffff') {
      setBgColor('#09090b');
    }
  };

  // Generate QR code on hidden canvas with center icon overlay if selected
  useEffect(() => {
    const canvas = canvasRef.current || document.createElement('canvas');
    QRCode.toCanvas(
      canvas,
      fullUrl,
      {
        width: 440,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H', // Always High when embedding logo
      },
      (err) => {
        if (err) {
          console.error('QR error:', err);
          return;
        }

        if (centerIcon === 'none') {
          setQrDataUrl(canvas.toDataURL('image/png'));
          return;
        }

        // Draw center logo badge on canvas
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const centerSize = size * 0.22;
        const centerPos = (size - centerSize) / 2;

        // Draw clean white background badge for center icon
        ctx.fillStyle = bgColor === '#09090b' ? '#09090b' : '#ffffff';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, centerSize / 2 + 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = fgColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw center icon
        ctx.fillStyle = fgColor;
        ctx.font = `bold ${centerSize * 0.55}px -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (centerIcon === 'zap') {
          ctx.fillText('⚡', size / 2, size / 2);
        } else if (centerIcon === 'github') {
          ctx.fillText('🐙', size / 2, size / 2);
        } else if (centerIcon === 'twitter') {
          ctx.fillText('𝕏', size / 2, size / 2);
        } else if (centerIcon === 'globe') {
          ctx.fillText('🌐', size / 2, size / 2);
        }

        setQrDataUrl(canvas.toDataURL('image/png'));
      }
    );
  }, [fullUrl, fgColor, bgColor, errorCorrection, centerIcon]);

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
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
        style={{ maxWidth: '600px', width: '100%', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden canvas for compositing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              QR Code Studio
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem' }}>
              <code style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {fullUrl}
              </code>
              <button 
                onClick={handleCopyLink} 
                className="btn-ghost" 
                style={{ padding: '2px 6px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                title="Copy short URL"
              >
                {copied ? <><Check size={12} color="#15803d" /> Copied</> : <><Copy size={12} /></>}
              </button>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '190px minmax(0, 1fr)', 
            gap: '1.75rem', 
            alignItems: 'center' 
          }}>
            
            {/* 1:1 Aspect Ratio Bounded Frame */}
            <div style={{
              width: '190px',
              height: '190px',
              backgroundColor: bgColor,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-subtle)',
              padding: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    display: 'block' 
                  }} 
                />
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generating...</div>
              )}
            </div>

            {/* Customization Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', minWidth: 0 }}>
              
              {/* QR Color Swatches */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  QR Color
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleFgChange(color)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: fgColor === color ? '2px solid var(--text-primary)' : '1px solid var(--border-default)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        transform: fgColor === color ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform var(--duration-fast) var(--ease-out)'
                      }}
                      aria-label={`Color ${color}`}
                    >
                      {fgColor === color && (
                        <Check size={11} color={color === '#09090b' ? '#ffffff' : color === '#ffffff' ? '#09090b' : '#ffffff'} />
                      )}
                    </button>
                  ))}

                  {/* Custom color picker button */}
                  <div style={{ position: 'relative', display: 'inline-flex' }}>
                    <button
                      type="button"
                      onClick={() => colorInputRef.current?.click()}
                      className="btn-icon"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid var(--border-default)',
                        backgroundColor: 'var(--bg-muted)',
                        padding: 0
                      }}
                      title="Custom color"
                      aria-label="Custom color picker"
                    >
                      <Pipette size={11} />
                    </button>
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={fgColor}
                      onChange={(e) => handleFgChange(e.target.value)}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                      aria-label="Custom color input"
                    />
                  </div>
                </div>
              </div>

              {/* Background Color Swatches */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Background
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {PRESET_BGS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleBgChange(color)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: color,
                        border: bgColor === color ? '2px solid var(--text-primary)' : '1px solid var(--border-default)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                      aria-label={`Background ${color}`}
                    >
                      {bgColor === color && (
                        <Check size={11} color={color === '#09090b' ? '#ffffff' : '#09090b'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Logo / Icon Badge */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Center Icon Badge
                </label>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {CENTER_ICONS.map(icon => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => setCenterIcon(icon.id)}
                      className={`btn ${centerIcon === icon.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                    >
                      {icon.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Correction Level */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Error Correction Level
                </label>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'L', label: 'Low (7%)' },
                    { id: 'M', label: 'Medium (15%)' },
                    { id: 'Q', label: 'Quartile (25%)' },
                    { id: 'H', label: 'High (30%)' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setErrorCorrection(lvl.id)}
                      className={`btn ${errorCorrection === lvl.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="modal-footer">
          <button onClick={handleDownloadPNG} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Download size={14} /> Download PNG
          </button>
          <button onClick={handleDownloadSVG} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Download size={14} /> Download Vector SVG
          </button>
        </div>
      </div>
    </div>
  );
}
