export interface InventoryItem {
  id: string;
  category: string;
  name: string;
  brand: string;
  quantity: number;
  unit: string;
  location: string;
  purchaseDate: string;
  expiryDate: string;
  notes: string;
  quantityRemaining: string;
  createdAt: string;
}

const API_URL = 'http://localhost:3000/api/items';

// Get JWT token from localStorage
function getToken(): string {
  return localStorage.getItem('shelfsafe-token') ?? '';
}

// Auth headers
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

export async function getItems(): Promise<InventoryItem[]> {
  try {
    const res = await fetch(API_URL, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({ ...item, id: item._id }));
  } catch {
    return [];
  }
}

export async function addItem(item: Omit<InventoryItem, "id" | "createdAt">): Promise<InventoryItem> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
  const data = await res.json();
  return { ...data, id: data._id };
}

export async function removeItem(id: string): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}