'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import SearchableSelect from './SearchableSelect';

export type CollectorOption = {
  id: string;
  label: string;
  name: string;
  role: 'MANAGER' | 'AGENT';
};

type ManagerResponse = {
  id: string | number;
  name: string;
  status?: string;
  managerCode?: string;
};

type AgentResponse = {
  id: string | number;
  name: string;
  status?: string;
  agentCode?: string;
};

interface Props {
  value: CollectorOption | null;
  onChange: (option: CollectorOption | null) => void;
  placeholder?: string;
}

/**
 * Loads active managers + agents from the backend and exposes them through
 * a searchable dropdown. The chosen option's `name` is what callers should
 * persist as the `collectedBy` field on a payment.
 */
export default function CollectorSelect({ value, onChange, placeholder }: Props) {
  const [collectors, setCollectors] = useState<CollectorOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [managersRes, agentsRes] = await Promise.all([
          fetch(API_ENDPOINTS.GET_ALL_MANAGERS, { credentials: 'include' }),
          fetch(API_ENDPOINTS.GET_ALL_AGENTS, { credentials: 'include' }),
        ]);

        const managersJson = managersRes.ok ? await managersRes.json() : [];
        const agentsJson = agentsRes.ok ? await agentsRes.json() : [];

        const managers: CollectorOption[] = (Array.isArray(managersJson) ? managersJson as ManagerResponse[] : [])
          .filter((m) => m?.status !== 'INACTIVE')
          .map((m) => ({
            id: `manager-${m.id}`,
            name: m.name,
            role: 'MANAGER' as const,
            label: `${m.name} - Manager${m.managerCode ? ` - ${m.managerCode}` : ''}`,
          }));

        const agents: CollectorOption[] = (Array.isArray(agentsJson) ? agentsJson as AgentResponse[] : [])
          .filter((a) => a?.status !== 'INACTIVE')
          .map((a) => ({
            id: `agent-${a.id}`,
            name: a.name,
            role: 'AGENT' as const,
            label: `${a.name} - Agent${a.agentCode ? ` - ${a.agentCode}` : ''}`,
          }));

        if (!cancelled) {
          setCollectors([...managers, ...agents]);
        }
      } catch (err) {
        console.error('Failed to load collectors', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedPlaceholder =
    placeholder ??
    (loading
      ? 'Loading collectors...'
      : collectors.length === 0
      ? 'No managers / agents found'
      : 'Search & select collector');

  return (
    <SearchableSelect
      options={collectors}
      value={value}
      onChange={(opt) => onChange(opt as CollectorOption)}
      placeholder={resolvedPlaceholder}
    />
  );
}
