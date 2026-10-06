import React, { useState } from 'react';
import { 
  X, User, Mail, Lock, LogIn, UserPlus, LogOut, CheckCircle2, ShieldCheck, Sparkles 
} from 'lucide-react';
import { apiLogin, apiRegister, apiLogout } from '../services/api';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // login | register | profile
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (mode === 'login') {
        res = await apiLogin(email, password);
      } else {
        res = await apiRegister(email, password, name);
      }

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });

      if (onAuthSuccess) onAuthSuccess(res.user, res.workspaces, res.activeWorkspaceId);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await apiLogin('demo@kissurl.dev', 'demo1234');
      if (onAuthSuccess) onAuthSuccess(res.user, res.workspaces, res.activeWorkspaceId);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to sign in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiLogout();
    if (onAuthSuccess) onAuthSuccess(null, [], null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '420px', position: 'relative' }}
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
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} /> {user ? 'Account Profile' : (mode === 'login' ? 'Sign In to KissURL' : 'Create an Account')}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user ? 'Manage your account and workspaces.' : 'Persist your workspaces, links, and analytics.'}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {user ? (
            /* Logged-in State */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                border: '2px solid var(--border-default)'
              }}>
                👤
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                {user.name || 'User'}
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {user.email}
              </div>

              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}>
                <ShieldCheck size={15} color="#10b981" /> Authenticated & Server-Isolated Session
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '100%', color: 'var(--error-text)', gap: '0.4rem' }}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            /* Sign In / Sign Up Forms */
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--error-bg)',
                  border: '1px solid var(--error-border)',
                  color: 'var(--error-text)',
                  fontSize: '0.8rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              {mode === 'register' && (
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '0.75rem', padding: '0.5rem' }}
              >
                {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account & Default Workspace')}
              </button>

              {/* 1-Click Demo Sign-in */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem', marginBottom: '1.25rem', gap: '0.35rem' }}
              >
                <Sparkles size={13} /> 1-Click Demo Login (Alex Rivera)
              </button>

              {/* Toggle Login / Register */}
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setError('');
                      }}
                      className="btn-ghost"
                      style={{ padding: '0 4px', fontWeight: '600', color: 'var(--primary-bg)' }}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError('');
                      }}
                      className="btn-ghost"
                      style={{ padding: '0 4px', fontWeight: '600', color: 'var(--primary-bg)' }}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
