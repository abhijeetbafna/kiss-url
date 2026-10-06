// Client API Service for KissURL Backend & Persistent Workspace Isolation

const API_BASE = '/api';

const TOKEN_KEY = 'kissurl_auth_token_v1';
const ACTIVE_WS_KEY = 'kissurl_active_ws_v1';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export const getSavedActiveWorkspaceId = () => localStorage.getItem(ACTIVE_WS_KEY);
export const setSavedActiveWorkspaceId = (wsId) => {
  if (wsId) localStorage.setItem(ACTIVE_WS_KEY, wsId);
  else localStorage.removeItem(ACTIVE_WS_KEY);
};

// Generic fetch wrapper with automatic authentication & workspace headers
async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const activeWsId = getSavedActiveWorkspaceId();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(activeWsId ? { 'x-workspace-id': activeWsId } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Clear expired auth session
      // setAuthToken(null);
    }
    const error = new Error(data.error || `HTTP error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ==========================================
// 1. AUTHENTICATION API
// ==========================================

export const apiLogin = async (email, password) => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    setAuthToken(res.token);
    if (res.activeWorkspaceId) setSavedActiveWorkspaceId(res.activeWorkspaceId);
  }
  return res;
};

export const apiRegister = async (email, password, name) => {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  if (res.token) {
    setAuthToken(res.token);
    if (res.activeWorkspaceId) setSavedActiveWorkspaceId(res.activeWorkspaceId);
  }
  return res;
};

export const apiGetMe = async () => {
  return await request('/auth/me');
};

export const apiLogout = () => {
  setAuthToken(null);
};

// ==========================================
// 2. WORKSPACES API (SERVER-AUTHORITATIVE)
// ==========================================

export const apiGetWorkspaces = async () => {
  return await request('/workspaces');
};

export const apiCreateWorkspace = async ({ name, icon, color, description }) => {
  return await request('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name, icon, color, description }),
  });
};

export const apiGetWorkspaceById = async (workspaceId) => {
  return await request(`/workspaces/${workspaceId}`);
};

export const apiUpdateWorkspace = async (workspaceId, data) => {
  return await request(`/workspaces/${workspaceId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiDeleteWorkspace = async (workspaceId) => {
  return await request(`/workspaces/${workspaceId}`, {
    method: 'DELETE',
  });
};

// ==========================================
// 3. WORKSPACE LINKS & ANALYTICS API
// ==========================================

export const apiGetWorkspaceLinks = async (workspaceId) => {
  return await request(`/workspaces/${workspaceId}/links`);
};

export const apiCreateWorkspaceLink = async (workspaceId, linkData) => {
  return await request(`/workspaces/${workspaceId}/links`, {
    method: 'POST',
    body: JSON.stringify(linkData),
  });
};

export const apiUpdateWorkspaceLink = async (workspaceId, linkId, data) => {
  return await request(`/workspaces/${workspaceId}/links/${linkId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiDeleteWorkspaceLink = async (workspaceId, linkId) => {
  return await request(`/workspaces/${workspaceId}/links/${linkId}`, {
    method: 'DELETE',
  });
};

export const apiGetWorkspaceAnalytics = async (workspaceId) => {
  return await request(`/workspaces/${workspaceId}/analytics`);
};

export const apiGetLinkAnalytics = async (workspaceId, linkId) => {
  return await request(`/workspaces/${workspaceId}/links/${linkId}/analytics`);
};

// ==========================================
// 4. BIO PAGES & CUSTOM DOMAINS API
// ==========================================

export const apiGetWorkspaceBio = async (workspaceId) => {
  return await request(`/workspaces/${workspaceId}/bio`);
};

export const apiSaveWorkspaceBio = async (workspaceId, bioData) => {
  return await request(`/workspaces/${workspaceId}/bio`, {
    method: 'POST',
    body: JSON.stringify(bioData),
  });
};

export const apiGetWorkspaceBioLeads = async (workspaceId, handle) => {
  return await request(`/workspaces/${workspaceId}/bio/leads?handle=${encodeURIComponent(handle || '')}`);
};

export const apiGetWorkspaceDomains = async (workspaceId) => {
  return await request(`/workspaces/${workspaceId}/domains`);
};

export const apiAddWorkspaceDomain = async (workspaceId, domain) => {
  return await request(`/workspaces/${workspaceId}/domains`, {
    method: 'POST',
    body: JSON.stringify({ domain }),
  });
};

export const apiDeleteWorkspaceDomain = async (workspaceId, domainId) => {
  return await request(`/workspaces/${workspaceId}/domains/${domainId}`, {
    method: 'DELETE',
  });
};

export const apiGetWorkspaceErrorBranding = async (workspaceId) => {
  return await request(`/workspaces/${workspaceId}/error-branding`);
};

export const apiSaveWorkspaceErrorBranding = async (workspaceId, settings) => {
  return await request(`/workspaces/${workspaceId}/error-branding`, {
    method: 'POST',
    body: JSON.stringify(settings),
  });
};

// ==========================================
// 5. PUBLIC REDIRECT & BIO RESOLUTION
// ==========================================

export const apiResolvePublicLink = async (slug) => {
  return await request(`/public/resolve/${slug}`);
};

export const apiGetPublicBio = async (handle) => {
  return await request(`/public/bio/${handle}`);
};

export const apiSubmitPublicBioLead = async (handle, email) => {
  return await request(`/public/bio/${handle}/leads`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};
