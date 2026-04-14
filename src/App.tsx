import React, { useState } from 'react'
import { DataTable } from './components/DataTable'
import { calcularDiferenciaDias } from './utils/date-utils'

// Tipo de muestra para probar la DataTable
interface Tarea {
  id: string;
  titulo: string;
  completada: boolean;
}

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: "1", titulo: "Aprender TypeScript", completada: true },
    { id: "2", titulo: "Masterizar React + Vite", completada: false }
  ]);

  const [diferencia] = useState(() => 
    calcularDiferenciaDias(new Date('2024-01-01'), new Date('2024-01-10'))
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestor de Tareas</h1>
      <p>Días de diferencia (Prueba date-fns): {diferencia} días</p>
      
      <DataTable
        data={tareas}
        columns={[
          { key: "id", header: "ID de la Tarea" },
          { key: "titulo", header: "Título Principal" },
          { key: "completada", header: "Completada" }
        ]}
        onEdit={(original, actualizado) => {
          console.log("Original:", original, "Actualizado:", actualizado);
          setTareas(prev => prev.map(t => t.id === original.id ? { ...t, ...actualizado } : t));
        }}
      />
    </div>
  )
}

export default App
