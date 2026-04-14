# React + TS + Vite Modern UI

Página web y arquitectura base para el desarrollo de una interfaz de usuario escalable con React y TypeScript, enfocada en el tipado estricto, abstracciones genéricas y la máxima prevención de errores en tiempo de ejecución.

## 📁 Arquitectura de Carpetas

```text
react/
├── docs/               # Documentación y defensas arquitectónicas
├── src/                # Código fuente principal
│   ├── components/     # Componentes de UI reusables (DataTable genérica)
│   ├── utils/          # Funciones utilitarias (manipulación de fechas)
│   ├── App.tsx         # Punto de entrada de la UI
│   └── main.tsx        # Renderizado raíz de React
├── index.html          # Estructura principal
├── package.json        # Gestión de dependencias
├── tsconfig.json       # Configuración estricta de TypeScript
└── vite.config.ts      # Configuración del bundler
```

## 🛠️ Tecnologías Empleadas

### Core Application
- **React**: Biblioteca central para el diseño declarativo de componentes y la gestión del DOM virtual.
- **TypeScript**: Habilita el análisis estático exhaustivo. El proyecto opera con reglas estrictas (`strict: true`), Uniones Discriminadas y Genéricos para bloquear todo tipo de *bugs* silenciosos comunes de JS estándar.
- **Vite**: Bundler de nueva generación configurado para un Hot Module Replacement (HMR) inmediato.
- **date-fns**: Herramienta de alta fiabilidad para las operaciones de tiempo, que envuelta en nuestros utilitarios detiene posibles inyecciones de strings u timestamps incorrectos forzando objetos `Date`.

## 🚀 Cómo empezar

1.  Instala las dependencias:
    ```bash
    npm install
    ```
2.  Arranca el servidor en modo de desarrollo:
    ```bash
    npm run dev
    ```
3.  Verifica los tipos y preparara el *build*:
    ```bash
    npm run build
    ```
    *Nota: Si prefieres solo comprobar que el código es robusto a nivel de arquitectura funcional sin lanzar empaquetados pesados, puedes usar `npx tsc --noEmit`.*

## 📖 Documentación Adicional

Para interiorizar por completo por qué se ha optado por enjaular ciertos comportamientos bajo Genéricos `<T>`, el uso del patrón *Exhaustive Checks* (`never`), y cómo los *Utility Types* protegen los comportamientos en pantalla, acude a:
- [Arquitectura Final y Análisis de Tipado en React + TypeScript](docs/arquitectura-final.md)

---

## ⚡ Usabilidad e Interacción (UI Component)

### Control Dinámico: La `DataTable<T>`
El proyecto destaca por la construcción de un componente de tabla maestra completamente agnóstica que adopta de forma fluida el tipo de cualquier dato que necesite ser renderizado en la estructura de la compañía. Al basarse en la clave `keyof T`, evita de fábrica que llamemos a propiedades mal deletreadas de nuestras entidades.

#### Características en Tiempo de Ejecución:
- **Ordenamiento Multidimensional**: Los usuarios pueden clicar cualquiera de los encabezados (`<th>`) de la tabla. El componente actualizará los iconos `↑`/`↓` en la pestaña activa y auto-organizará ascendentemente o descendentemente la lista.
- **Micro-interacciones y Edición Fluida (`Partial<T>`)**: Integración de un modo edición nativo por fila. Se permite modificar libremente de forma iterativa y temporal el campo o título expuesto en los inputs hasta darle a *Guardar*, fusionando los datos nuevos mitigando colisiones.

**Ejemplo representativo de Uso:**
```tsx
import { DataTable } from './components/DataTable';

interface Empleado { id: string; nombre: string; rol: string }

const plantilla: Empleado[] = [
  { id: 'usr-1', nombre: 'Daniel', rol: 'Ingeniero de Software' }
];

<DataTable
  data={plantilla}
  columns={[
    { key: "id", header: "Identificador" },
    { key: "nombre", header: "Nombre del Trabajador" }
  ]}
  onEdit={(original, actualizado) => dispararEventoAPI(actualizado)}
/>
```
