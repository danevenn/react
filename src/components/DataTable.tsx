import { useState } from 'react';

// Tipo helper para requerir la propiedad id
export interface Identifiable {
  id: string | number;
}

export interface Column<T> {
  key: keyof T;
  header: string;
}

interface DataTableProps<T extends Identifiable> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (original: T, updated: Partial<T>) => void;
}

export function DataTable<T extends Identifiable>({ data, columns, onEdit }: DataTableProps<T>) {
  // Manejo del estado del id que está en edición actualmente
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  // Usamos Partial<T> para poder modificar la fila paso a paso sin causar errores en campos no presentes temporalmente
  const [editState, setEditState] = useState<Partial<T>>({});

  const handleEditClick = (item: T) => {
    setEditingId(item.id);
    setEditState(item);
  };

  const handleSaveClick = (item: T) => {
    if (onEdit) {
      onEdit(item, editState);
    }
    setEditingId(null);
    setEditState({});
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditState({});
  };

  const handleChange = (key: keyof T, value: string | boolean) => {
    setEditState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} style={{ padding: '8px' }}>
              {col.header}
            </th>
          ))}
          <th style={{ padding: '8px' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          const isEditing = editingId === item.id;
          
          return (
            <tr key={item.id}>
              {columns.map(col => {
                const cellValue = isEditing && editState[col.key] !== undefined 
                    ? editState[col.key] 
                    : item[col.key];

                return (
                  <td key={String(col.key)} style={{ padding: '8px' }}>
                    {isEditing ? (
                      <input
                        value={String(cellValue)}
                        onChange={(e) => handleChange(col.key, e.target.value)}
                      />
                    ) : (
                      String(item[col.key])
                    )}
                  </td>
                );
              })}
              <td style={{ padding: '8px' }}>
                {isEditing ? (
                  <>
                    <button onClick={() => handleSaveClick(item)} style={{ marginRight: '8px' }}>
                      Guardar
                    </button>
                    <button onClick={handleCancelClick}>Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(item)}>Editar</button>
                )}
              </td>
            </tr>
          );
        })}
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '16px' }}>
              No hay datos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
