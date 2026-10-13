// client/src/services/api.ts
// Standard Fetch-based REST client connecting to /api/v1 with auto JWT headers.

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
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData: any) =>
    request<{ user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  me: () => request<{ user: any }>('/auth/me'),

  // Public Verification
  verifyBatch: (batchNumber: string) =>
    request<any>(`/verification/${encodeURIComponent(batchNumber)}`),
  verifyHash: (batchNumber: string, documentHash: string) =>
    request<{ batchNumber: string; isMatch: boolean; certifiedAt?: string }>('/verification/verify-hash', {
      method: 'POST',
      body: JSON.stringify({ batchNumber, documentHash }),
    }),
  getBatchAiAnalysis: (batchNumber: string) =>
    request<any>(`/ai/batches/${encodeURIComponent(batchNumber)}/analyze`),

  // Products
  listProducts: () => request<{ products: any[] }>('/products'),
  createProduct: (productData: any) =>
    request<{ product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  // Batches
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

  // Transfers
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

  // Inventory
  listInventory: () => request<{ inventory: any[] }>('/inventory'),

  // Recalls
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

  // Organizations
  listOrganizations: () => request<{ organizations: any[] }>('/organizations'),

  // Ledger Explorer
  listLedgerTransactions: () =>
    request<{ transactions: any[]; outbox: any }>('/ledger/transactions'),
};
