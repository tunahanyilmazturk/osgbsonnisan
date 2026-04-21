import React from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  pageSize?: number;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  sortable = false,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: string) => {
    if (!sortable) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                  column.sortable && sortable ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors' : ''
                }`}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortable && sortConfig?.key === String(column.key) && (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                  {column.render ? column.render(row[column.key as keyof T], row) : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Veri bulunamadı</p>
        </div>
      )}
    </div>
  );
}
