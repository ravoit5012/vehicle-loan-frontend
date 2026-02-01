'use client';

import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { API_ENDPOINTS } from '@/app/config/config';

type Manager = {
  id: string;
  name: string;
  managerCode: string;
  phoneNumber: string;
};

export default function ManagerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchManagers() {
    const res = await fetch(API_ENDPOINTS.GET_ALL_MANAGERS, {
      credentials: 'include',
    });
    setManagers(await res.json());
  }

  const selected = managers.find(m => m.id === value);

  const filtered = managers.filter(m =>
    `${m.name}${m.managerCode}${m.phoneNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full max-w-md space-y-1">
      <label className="my-2 py-2 font-medium">Assign Manager</label>

      {/* Select box */}
      <div
        onClick={() => setOpen(o => !o)}
        className="input flex border-2 mt-2 hover:scale-110 transition-all ease-in-out duration-300 border-gray-700 px-4 py-2 rounded-xl items-center justify-between cursor-pointer"
      >
        <span className={selected ? '' : 'text-gray-400'}>
          {selected ? selected.name : 'Select manager'}
        </span>
        <FaChevronDown
          className={`transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow-lg">
          {/* Search */}
          <div className="relative border-b">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full py-2 pl-10 pr-3 outline-none text-sm"
              placeholder="Search manager..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No managers found
              </div>
            )}

            {filtered.map(m => (
              <div
                key={m.id}
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer hover:bg-blue-50 ${
                  value === m.id ? 'bg-blue-100 font-medium' : ''
                }`}
              >
                <div>{m.name}</div>
                <div className="text-xs text-gray-500">
                  {m.managerCode} • {m.phoneNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
