# 📊 Base de Datos On-Chain en Stellar Soroban

Sistema de almacenamiento descentralizado con indexación avanzada para
consultas eficientes.

## 🎯 ¿Qué es este contrato?

Este contrato inteligente funciona como una base de datos persistente
dentro de la blockchain de Stellar.\
Permite almacenar registros, generar índices de búsqueda y consultarlos
por múltiples criterios.

### ✔ Casos de uso

-   Sistemas de registro de transacciones\
-   Auditoría y trazabilidad\
-   Historiales de actividad\
-   Registros contables\
-   Tracking de eventos o entregas

------------------------------------------------------------------------

## 📋 Estructura de Datos

### Objeto `Registro`

``` rust
Registro {
    id: u128,           
    persona: String,    
    monto: u32,         
    fecha_hora: String  
}
```

### Ejemplo

``` json
{
  "id": 1,
  "persona": "Juan Perez",
  "monto": 1500,
  "fecha_hora": "2024-11-22 14:30:00"
}
```

------------------------------------------------------------------------

## 🏗 Arquitectura del Storage

### Keys utilizadas:

``` rust
enum DataKey {
    ContadorId,
    Registro(u128),
    RegistrosPorPersona(String),
    RegistrosPorFecha(String),
}
```

### Explicación

-   **ContadorId**: Maneja el último ID generado.\
-   **Registro(id)**: Guarda cada registro completo.\
-   **RegistrosPorPersona**: Lista de IDs por nombre de persona.\
-   **RegistrosPorFecha**: Lista de IDs por timestamp exacto.

------------------------------------------------------------------------

## 🔧 Funciones del Contrato

### `inicializar()`

Configura el contador en 0 si no existe.\
✔ Se ejecuta una sola vez.

------------------------------------------------------------------------

### `crear_registro(persona, monto, fecha_hora) → u128`

Crea un nuevo registro siguiendo este flujo: 1. Lee contador\
2. Incrementa\
3. Guarda registro\
4. Actualiza índice por persona\
5. Actualiza índice por fecha\
6. Retorna ID

------------------------------------------------------------------------

### `obtener_por_id(id)`

Obtiene un registro por su ID.\
✔ Complejidad: 1 lectura

------------------------------------------------------------------------

### `listar_por_persona(persona)`

Devuelve todos los registros de una persona.\
⚡ Súper eficiente gracias al índice.

------------------------------------------------------------------------

### `listar_por_fecha(fecha_hora)`

Devuelve todos los registros de una fecha exacta.

------------------------------------------------------------------------

### `listar_todos()`

Retorna todos los registros desde ID = 1 hasta el máximo.\
⚠ Puede ser costoso si hay muchos registros.

------------------------------------------------------------------------

### `obtener_contador()`

Retorna el último ID generado.

------------------------------------------------------------------------

## 💡 Ventajas del Sistema de Indexación

### Sin índices (búsqueda lineal)

1000 registros → 1000 lecturas

### Con índices (este contrato)

1000 registros totales, 3 de Juan → 4 lecturas\
🔥 **250x más eficiente**

------------------------------------------------------------------------

## 🔒 Seguridad

-   Los datos son inmutables\
-   No hay borrado ni actualización\
-   No incluye control de acceso (puedes añadirlo)

------------------------------------------------------------------------

## 📦 Estado del Storage (Ejemplo)

    ContadorId: 3
    Registro(1): {...}
    Registro(2): {...}
    Registro(3): {...}

    Índice Persona:
      Juan Perez → [1, 3]
      Maria Lopez → [2]

    Índice Fecha:
      2024-11-22 14:30 → [1]
      2024-11-22 15:00 → [2]
      2024-11-23 10:00 → [3]

------------------------------------------------------------------------

## 📘 Licencia

MIT --- libre uso para proyectos educativos, académicos o empresariales.

------------------------------------------------------------------------

## 🚀 Autor

Desarrollado como ejemplo educativo para demostrar estructuras avanzadas
en **Stellar Soroban**.
