const API_BASE = '/api/v1';

function getToken(): string | null {
  return localStorage.getItem('securechain_token');
}

export function setToken(token: string) {
  localStorage.setItem('securechain_token', token);
}

export function clearToken() {
  localStorage.removeItem('securechain_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    if (data?.details) {
      if (typeof data.details === 'string') {
        errorMsg += `: ${data.details}`;
      } else if (typeof data.details === 'object') {
        const detailsStr = Object.entries(data.details)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('; ');
        if (detailsStr) {
          errorMsg += `: ${detailsStr}`;
        }
      }
    }
    throw new Error(errorMsg);
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  login: (credentials: { email: string; password: string }) =>
    request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData: any) =>
    request<{ user: any; accessToken?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getOrganizations: () =>
    request<{ organizations: Array<{ id: string; name: string; type: string }> }>('/auth/organizations'),
  me: () => request<{ user: any }>('/auth/me'),

  verifyBatch: (batchNumber: string) =>
    request<any>(`/verification/${encodeURIComponent(batchNumber)}`),
  verifyHash: (batchNumber: string, documentHash: string) =>
    request<{ batchNumber: string; isMatch: boolean; certifiedAt?: string }>('/verification/verify-hash', {
      method: 'POST',
      body: JSON.stringify({ batchNumber, documentHash }),
    }),
  getBatchAiAnalysis: (batchNumber: string) =>
    request<any>(`/ai/batches/${encodeURIComponent(batchNumber)}/analyze`),

  listProducts: () => request<{ products: any[] }>('/products'),
  createProduct: (productData: any) =>
    request<{ product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  listBatches: () => request<{ batches: any[] }>('/batches'),
  createBatch: (batchData: any) =>
    request<{ batch: any }>('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    }),
  approveBatch: (batchId: string) =>
    request<{ batch: any }>(`/batches/${batchId}/approve`, {
      method: 'PATCH',
    }),

  listTransfers: () => request<{ transfers: any[] }>('/transfers'),
  initiateTransfer: (data: { batchId: string; receiverId: string; quantity: number; notes?: string }) =>
    request<{ transfer: any }>('/transfers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  confirmReceipt: (transferId: string, notes?: string) =>
    request<{ transfer: any }>(`/transfers/${transferId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
  rejectTransfer: (transferId: string, reason: string) =>
    request<{ transfer: any }>(`/transfers/${transferId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  listInventory: () => request<{ inventory: any[] }>('/inventory'),

  listRecalls: () => request<{ recalls: any[] }>('/recalls'),
  initiateRecall: (data: { reason: string; description?: string; batchIds: string[] }) =>
    request<{ recall: any }>('/recalls', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  acknowledgeRecall: (recallId: string, batchId: string, notes?: string) =>
    request<{ acknowledged: any }>(`/recalls/${recallId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ batchId, notes }),
    }),

  listOrganizations: () => request<{ organizations: any[]; orgs: any[] }>('/organizations?pageSize=100'),

  listLedgerTransactions: () =>
    request<{ transactions: any[]; outbox: any }>('/ledger/transactions'),
};
