# Arquitectura Final y Análisis de Tipado en React + TypeScript

Este documento recopila las conclusiones tras implementar TypeScript en un entorno que va desde la capa de datos de dominio puro, solicitudes de API e interfaces de usuario avanzadas (UI). 

## Prevención de errores en tiempo de ejecución (Runtime Errors)

A lo largo del proyecto usamos abstracciones robustas de TypeScript que han eliminado prácticamente la necesidad de depurar errores triviales de JS que de otro modo solo descubriríamos cuando el usuario intenta usar la aplicación.

### 1. El uso de Genéricos `<T>`
Los **Genéricos** (ej. componente `DataTable<T>` o métodos como `obtenerRecurso<T>`) abstraen la lógica operativa impidiendo mezclas en runtime. En un sistema JS estándar, diseñar una tabla que acepte columnas como `{ key: "nombre" }` no validaría que los datos pasados realmente posean el campo `"nombre"`.
Gracias a TypeScript (`key: keyof T`), si un desarrollador pasa una configuración de columna que no corresponde a una propiedad válida del objeto, el proyecto simplemente no compila. Esto mata el típico error de `undefined` en la renderización del DOM.
Adicionalmente, hemos expandido la `DataTable<T>` habilitando el **ordenamiento ascendente y descendente**. Gracias a los genéricos, asociamos dinámicamente nuestra clave de ordenamiento en el estado `sortConfig` forzando de nuevo a que sea de tipo `keyof T`.

### 2. Integración Estricta de Date-fns
En el ecosistema tradicional de Javascript, las fechas son propensas a errores debido a que carecemos de un mecanismo para distinguir si un parámetro espera un _timestamp_ (número), una cadena formato ISO (string) o una instancia de `Date`.
Al integrar la librería `date-fns`:
```typescript
import { differenceInDays } from 'date-fns';
export function calcularDiferenciaDias(fechaInicio: Date, fechaFin: Date): number {
    return differenceInDays(fechaFin, fechaInicio);
}
```
Nos blindamos frente a manipulaciones inválidas al forzar a nivel de contrato técnico que nuestra función solo reciba e interopere con instancias reales, evitando excepciones de formato interno.

### 3. Uniones Discriminadas y el patrón Exhaustive Checks (`never`)
Las Uniones Discriminadas (`EstadoMatricula`) aseguran que si una entidad posee una forma A, tratar de acceder a los campos de la forma B lanzará error. Al acoplar el tipo especial `never` en el bloque `default` del `switch`:
```typescript
const _exhaustiveCheck: never = estado;
```
Forzamos a que si un usuario del equipo incorpora una nueva estructura, se detecte a nivel estático.

### 4. Tipos de Utilidad (`Partial<T>`)
Al usar `Partial<T>` para el estado temporal en la redición del componente `DataTable`:
Hemos modelado semánticamente un flujo condicionado natural de UI: el usuario tiene en memoria un fragmento del registro. Modifica la fila sin conflictos mientras TS valida que los nombres de las claves sean válidas.

## Conclusión
La compilación satisfactoria de `tsc --noEmit` nos garantiza que cualquier refactorización requerirá menor esfuerzo y reducirá drásticamente los errores en tiempo de ejecución en producción.
