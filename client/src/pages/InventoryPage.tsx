import React, { useState, useEffect } from 'react';
import { PackageCheck, Clock, ShieldCheck, Thermometer, Layers } from 'lucide-react';
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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      <div style={{ marginBottom: '2.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#64748b',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <span>SecureChain</span>
          <span>/</span>
          <span>Enterprise Workspace</span>
          <span>/</span>
          <span style={{ color: '#0f172a' }}>Inventory Stock</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#0f172a',
          lineHeight: 1.2,
          marginBottom: '0.4rem'
        }}>
          Warehouse Stock & Balances
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '720px' }}>
          Real-time physical inventory tracked for <strong style={{ color: '#0f172a' }}>{user.organization?.name || user.role}</strong> across verified node custody.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '1.6rem 1.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Held Stock
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} color="#f8fafc" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {totalStock.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>units</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Aggregate physical inventory on premise
            </div>
          </div>
        </div>

        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '1.6rem 1.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Available for Dispatch
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={18} color="#34d399" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#34d399', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {totalAvailable.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>units</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Certified salable & ready for release
            </div>
          </div>
        </div>

        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '1.6rem 1.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Reserved in Transit
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="#38bdf8" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {totalReserved.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>units</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Committed to active multi-party waybills
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.35)'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#05070d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Active Warehouse Inventory Records
            </div>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px'
            }}>
              {items.length} lots
            </span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <ShieldCheck size={14} /> Synchronized with Hyperledger Fabric
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
              Querying warehouse inventory...
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              Reconciling physical facility balances against ledger anchors.
            </div>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
            <PackageCheck size={44} style={{ margin: '0 auto 0.75rem', opacity: 0.4, color: '#ffffff' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
              No inventory records found
            </div>
            <p style={{ fontSize: '0.85rem' }}>No drug lots are currently held at this organization's facility.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Batch / Item</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Product Formulation</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Available Qty</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Reserved Qty</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Total Physical Qty</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Storage Requirements</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Expiration</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-block',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.1)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        fontSize: '0.85rem'
                      }}>
                        {item.batch.batchNumber}
                      </span>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.925rem', marginBottom: '0.2rem' }}>
                        {item.batch.product.brandName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {item.batch.product.genericName} • {item.batch.product.formulation} ({item.batch.product.strength})
                      </div>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <span style={{ color: '#34d399', fontWeight: 800, fontSize: '1.05rem' }}>
                        {item.availableQty.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <span style={{ color: item.reservedQty > 0 ? '#38bdf8' : '#64748b', fontWeight: 600 }}>
                        {item.reservedQty.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', fontWeight: 700, color: '#ffffff' }}>
                      {item.quantity.toLocaleString()}
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', fontSize: '0.825rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Thermometer size={14} color="#94a3b8" />
                        <span>{item.batch.storageConditions || 'Controlled room temperature'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', fontSize: '0.825rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} color="#94a3b8" />
                        <span>{item.batch.expiresAt ? new Date(item.batch.expiresAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
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
