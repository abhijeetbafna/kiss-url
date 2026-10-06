import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Check, 
  Settings, 
  Trash2, 
  X,
  Loader2,
  User,
  Rocket,
  Briefcase,
  Zap,
  Sparkles,
  Target,
  Flame,
  Globe,
  BarChart3,
  Wrench,
  Folder,
  Layers
} from 'lucide-react';
import { 
  getStoredWorkspaces, 
  getActiveWorkspace, 
  setActiveWorkspaceId, 
  createWorkspace, 
  deleteWorkspace,
  subscribeToStore 
} from '../services/storageService';

const ICON_MAP = {
  'user': User,
  '👤': User,
  'rocket': Rocket,
  '🚀': Rocket,
  'briefcase': Briefcase,
  '💼': Briefcase,
  'zap': Zap,
  '⚡': Zap,
  'sparkles': Sparkles,
  '🌟': Sparkles,
  'target': Target,
  '🎯': Target,
  'flame': Flame,
  '🔥': Flame,
  'globe': Globe,
  '🌐': Globe,
  'bar-chart': BarChart3,
  '📊': BarChart3,
  'wrench': Wrench,
  '🛠️': Wrench,
  'folder': Folder,
  '📁': Folder,
  'layers': Layers
};

export function WorkspaceIcon({ icon, size = 13, color }) {
  const IconComponent = ICON_MAP[icon] || Folder;
  return <IconComponent size={size} style={{ color: color || 'currentColor', flexShrink: 0 }} />;
}

const PRESET_ICONS = [
  { id: 'user', name: 'User', icon: User },
  { id: 'briefcase', name: 'Work', icon: Briefcase },
  { id: 'rocket', name: 'Growth', icon: Rocket },
  { id: 'zap', name: 'Speed', icon: Zap },
  { id: 'target', name: 'Focus', icon: Target },
  { id: 'globe', name: 'Global', icon: Globe },
  { id: 'bar-chart', name: 'Analytics', icon: BarChart3 },
  { id: 'folder', name: 'Project', icon: Folder },
  { id: 'sparkles', name: 'Special', icon: Sparkles },
  { id: 'layers', name: 'Stack', icon: Layers }
];

export default function WorkspaceSwitcher({ onWorkspaceChanged, onOpenSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState(getStoredWorkspaces());
  const [activeWs, setActiveWs] = useState(getActiveWorkspace());
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // New workspace form
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('folder');
  const [newDesc, setNewDesc] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      const wsList = getStoredWorkspaces();
      setWorkspaces(wsList);
      setActiveWs(getActiveWorkspace());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (wsId) => {
    setLoading(true);
    await setActiveWorkspaceId(wsId);
    const selected = workspaces.find(w => w.id === wsId) || workspaces[0];
    setActiveWs(selected);
    setIsOpen(false);
    setLoading(false);
    if (onWorkspaceChanged) onWorkspaceChanged(wsId);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    const created = await createWorkspace({
      name: newName,
      icon: newIcon,
      color: '#3b82f6',
      description: newDesc
    });

    const refreshed = getStoredWorkspaces();
    setWorkspaces(refreshed);
    setActiveWs(created);
    setIsCreating(false);
    setNewName('');
    setIsOpen(false);
    setLoading(false);
    if (onWorkspaceChanged) onWorkspaceChanged(created.id);
  };

  const handleDelete = async (e, wsId) => {
    e.stopPropagation();
    if (workspaces.length <= 1) {
      alert('You cannot delete your only workspace.');
      return;
    }
    if (window.confirm('Delete this workspace and all its associated links?')) {
      setLoading(true);
      await deleteWorkspace(wsId);
      const refreshed = getStoredWorkspaces();
      setWorkspaces(refreshed);
      const active = getActiveWorkspace();
      setActiveWs(active);
      setLoading(false);
      if (onWorkspaceChanged) onWorkspaceChanged(active.id);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-ghost"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.6rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.825rem',
          fontWeight: '500',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ 
          width: '20px', 
          height: '20px', 
          borderRadius: 'var(--radius-xs)', 
          backgroundColor: 'var(--bg-subtle)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--primary-bg)'
        }}>
          <WorkspaceIcon icon={activeWs?.icon} size={12} />
        </div>
        <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeWs?.name || 'Personal Space'}
        </span>
        <ChevronDown size={13} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '260px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-dropdown)',
            zIndex: 100,
            padding: '0.5rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {!isCreating ? (
            <>
              <div style={{ padding: '0.35rem 0.5rem 0.45rem', fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Workspaces ({workspaces.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', maxHeight: '200px', overflowY: 'auto' }}>
                {workspaces.map((ws) => {
                  const isSelected = activeWs?.id === ws.id;
                  return (
                    <div
                      key={ws.id}
                      onClick={() => handleSelect(ws.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.55rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--bg-subtle)' : 'transparent',
                        fontSize: '0.825rem',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: 'var(--radius-xs)', 
                          backgroundColor: 'var(--bg-subtle)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: isSelected ? 'var(--primary-bg)' : 'var(--text-secondary)',
                          flexShrink: 0
                        }}>
                          <WorkspaceIcon icon={ws.icon} size={13} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: isSelected ? '600' : '400', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {ws.name}
                          </div>
                          {ws.description && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {ws.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                        {isSelected && <Check size={14} style={{ color: 'var(--primary-bg)' }} />}
                        {workspaces.length > 1 && (
                          <button
                            onClick={(e) => handleDelete(e, ws.id)}
                            className="btn-icon"
                            style={{ width: '20px', height: '20px', padding: 0, opacity: 0.6 }}
                            title="Delete workspace"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.45rem', paddingTop: '0.45rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn btn-ghost"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontSize: '0.785rem',
                    padding: '0.4rem 0.5rem',
                    gap: '0.4rem'
                  }}
                >
                  <Plus size={13} /> Create Workspace
                </button>

                {onOpenSettings && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenSettings();
                    }}
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      fontSize: '0.785rem',
                      padding: '0.4rem 0.5rem',
                      gap: '0.4rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Settings size={13} /> Error Branding & 404s
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Create Workspace Sub-form */
            <form onSubmit={handleCreate} style={{ padding: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  New Workspace
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-icon"
                  style={{ width: '20px', height: '20px', padding: 0 }}
                >
                  <X size={12} />
                </button>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                  Workspace Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Growth Marketing"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input"
                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                  autoFocus
                  required
                />
              </div>

              {/* Icon presets */}
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Icon Badge
                </label>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {PRESET_ICONS.map((preset) => {
                    const PresetIcon = preset.icon;
                    const isSelected = newIcon === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setNewIcon(preset.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1px solid var(--border-strong)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--bg-muted)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? 'var(--primary-bg)' : 'var(--text-secondary)'
                        }}
                        title={preset.name}
                      >
                        <PresetIcon size={13} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

