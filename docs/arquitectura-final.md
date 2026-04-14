# Arquitectura Final y Análisis de Tipado en React + TypeScript

Este documento recopila las conclusiones tras implementar TypeScript en un entorno que va desde la capa de datos de dominio puro, solicitudes de API e interfaces de usuario avanzadas (UI). 

## Prevención de errores en tiempo de ejecución (Runtime Errors)

A lo largo del proyecto usamos abstracciones robustas de TypeScript que han eliminado prácticamente la necesidad de depurar errores triviales de JS que de otro modo solo descubriríamos cuando el usuario intenta usar la aplicación.

### 1. El uso de Genéricos `<T>`
Los **Genéricos** (ej. componente `DataTable<T>` o métodos como `obtenerRecurso<T>`) abstraen la lógica operativa impidiendo mezclas en runtime. En un sistema JS estándar, diseñar una tabla que acepte columnas como `{ key: "nombre" }` no validaría que los datos pasados realmente posean el campo `"nombre"`.
Gracias a TypeScript (`key: keyof T`), si un desarrollador pasa una configuración de columna que no corresponde a una propiedad válida del objeto, el proyecto simplemente no compila. Esto mata el típico undefined error en la renderización del DOM.

### 2. Uniones Discriminadas y el patrón Exhaustive Checks (`never`)
Las Uniones Discriminadas (`EstadoMatricula`) aseguran que si una entidad posee una forma A, tratar de acceder a los campos de la forma B lanzará error. Al acoplar el tipo especial `never` en el bloque `default` del `switch`:
```typescript
const _exhaustiveCheck: never = estado;
```
Forzamos a que si el día de mañana un usuario del equipo incorpora `"MatriculaRevision"` al estado sin implementar su lógica, aparezca una regresión inmediata a nivel estático (TSC). En JS nativo esto habría supuesto un silent failure o un salto de estado no capturado que rompería el proceso de negocio en el navegador o backend.

### 3. Tipos de Utilidad (`Partial<T>`)
Al usar `Partial<T>` para el estado temporal en la redición del componente `DataTable`:
```typescript
const [editState, setEditState] = useState<Partial<T>>({});
```
Hemos modelado semánticamente un flujo condicionado natural de UI: el usuario tiene en memoria un fragmento del registro (`{}`). Modifica la fila, cambia primero el título (enviando `Partial`), luego la fecha, etc. Al guardar hacemos el "merge" de forma validada. Si nos hubiésemos limitado a `T` puro, Typescript no nos dejaría instanciar un estado vacío y en JS habríamos rellenado silenciosamente con `undefined` perdiendo la validación de qué claves formaban parte real de la entidad final.

## Conclusión
La compilación satisfactoria de `tsc --noEmit` nos garantiza que cualquier re-actorización futura de los dominios o del árbol de componentes de React se hará sobre una base que documenta estructuralmente y valida su intención de funcionamiento sin requerir una enorme capa de defensive programming (tests de nulos / mapeos inseguros).
