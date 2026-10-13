import React, { useState, useEffect } from 'react';
import { PackageCheck } from 'lucide-react';
import { api } from '../services/api';
import type { InventoryItem, User } from '../types';

interface InventoryPageProps {
  user: User;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ user }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.listInventory();
        setItems(data.inventory || []);
      } catch (err) {
        console.error('Failed to load inventory:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalStock = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalReserved = items.reduce((acc, i) => acc + i.reservedQty, 0);
  const totalAvailable = items.reduce((acc, i) => acc + i.availableQty, 0);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Warehouse Stock & Balances</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Real-time physical inventory tracked for <strong style={{ color: '#fff' }}>{user.organization?.name || user.role}</strong>.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <div className="form-label">Total Held Stock</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {totalStock.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>units</span>
          </div>
        </div>
        <div className="glass-card">
          <div className="form-label">Available for Dispatch</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>
            {totalAvailable.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>units</span>
          </div>
        </div>
        <div className="glass-card">
          <div className="form-label">Reserved in Transit</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>
            {totalReserved.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>units</span>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading warehouse stock...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <PackageCheck size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No inventory records found for your facility.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Batch / Item</th>
                  <th>Product Formulation</th>
                  <th>Available Qty</th>
                  <th>Reserved Qty</th>
                  <th>Total Physical Qty</th>
                  <th>Storage Requirements</th>
                  <th>Expiration</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="font-mono" style={{ fontWeight: 600, color: '#38bdf8' }}>
                        {item.batch.batchNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>
                        {item.batch.product.brandName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.batch.product.genericName} • {item.batch.product.formulation} ({item.batch.product.strength})
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399', fontSize: '1rem' }}>
                        {item.availableQty.toLocaleString()}
                      </strong>
                    </td>
                    <td style={{ color: item.reservedQty > 0 ? '#38bdf8' : 'var(--text-muted)' }}>
                      {item.reservedQty.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>
                      {item.quantity.toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {item.batch.storageConditions || 'Standard warehouse'}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {item.batch.expiresAt ? new Date(item.batch.expiresAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
