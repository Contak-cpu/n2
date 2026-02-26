import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps<any>>(
  (
    {
      columns,
      data,
      keyExtractor,
      onRowClick,
      sortBy,
      sortOrder = 'asc',
      onSort,
      loading = false,
      emptyMessage = 'No hay datos para mostrar',
      striped = true,
      hoverable = true,
    },
    ref,
  ) => {
    return (
      <div className="w-full overflow-x-auto">
        <table ref={ref} className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                    column.width ? column.width : ''
                  }`}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.sortable && onSort ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      {column.label}
                      {sortBy === column.key && (
                        sortOrder === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  className={`border-b border-gray-200 ${
                    striped && index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } ${hoverable && onRowClick ? 'hover:bg-blue-50 cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-900">
                      {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);

DataTable.displayName = 'DataTable';
