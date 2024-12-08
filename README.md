# backend-CRUD-javascript
# Gestión de Pacientes - API REST

Este repositorio implementa una API REST para la gestión de pacientes y médicos en un entorno hospitalario utilizando **Node.js**, **Express.js** y **PostgreSQL**. Proporciona funcionalidades CRUD para manejar datos de pacientes y empleados médicos.

---

## **Estructura del Proyecto**

- **`index.js`**: Archivo principal donde se configuran las rutas y se inicia el servidor.
- **Base de Datos**: Configuración para conectar con una base PostgreSQL mediante el módulo `pg`.

---

## **Características**

1. **Gestión de Pacientes**
   - Crear, leer, actualizar y eliminar registros de pacientes.
   - Manejo de datos como nombre, dirección, teléfono, NIF, número de seguridad social, etc.

2. **Consulta de Médicos**
   - Filtrar empleados con el rol de médico desde la tabla `Empleados`.

3. **Validación de Errores**
   - Manejo de errores comunes, como entradas no válidas o registros inexistentes, con respuestas HTTP adecuadas.

---

## **Endpoints Disponibles**

### **Pacientes**
- **Crear un Paciente**  
  `POST /api/pacientes`  
  Crea un nuevo paciente y devuelve su `id`.

- **Listar Todos los Pacientes**  
  `GET /api/pacientes`  
  Devuelve todos los pacientes en formato JSON.

- **Obtener Paciente por ID**  
  `GET /api/pacientes/:id`  
  Busca un paciente por su `id`.

- **Actualizar Paciente**  
  `PUT /api/pacientes/:id`  
  Actualiza los campos enviados en el cuerpo de la solicitud.

- **Eliminar Paciente**  
  `DELETE /api/pacientes/:id`  
  Elimina un paciente por su `id`.

### **Empleados**
- **Listar Médicos**  
  `GET /api/empleados/medicos`  
  Devuelve todos los empleados cuyo tipo es "médico".

---

## **Instalación**

1. **Clonar este repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/gestion-hospitalaria.git
   cd gestion-hospitalaria
