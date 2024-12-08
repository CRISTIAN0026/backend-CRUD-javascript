const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

// Configuración de la base de datos
const DB_CONFIG = {
  user: "postgres",
  host: "localhost",
  database: "hospital_ejercicio_xyz",
  password: "123456789",
  port: 5432,
};

// Crear pool de conexiones
const pool = new Pool(DB_CONFIG);

const app = express();
app.use(cors());
app.use(express.json());

// Crear un nuevo paciente
app.post("/api/pacientes", async (req, res) => {
  const {
    nombre,
    direccion,
    telefono,
    codigoPostal,
    nif,
    numSeguridadSocial,
    medicoId,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Pacientes (nombre, direccion, telefono, codigo_postal, nif, num_seguridad_social, medico_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING paciente_id;`,
      [
        nombre,
        direccion,
        telefono,
        codigoPostal,
        nif,
        numSeguridadSocial,
        medicoId,
      ]
    );
    const pacienteId = result.rows[0].paciente_id;
    res
      .status(201)
      .json({ id: pacienteId, message: "Paciente creado exitosamente" });
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(500).json({ error: "Error al crear paciente" });
  }
});

// Leer todos los pacientes
app.get("/api/pacientes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Pacientes;");
    const pacientes = result.rows.map((p) => ({
      paciente_id: p.paciente_id,
      nombre: p.nombre,
      direccion: p.direccion,
      telefono: p.telefono,
      codigo_postal: p.codigo_postal,
      nif: p.nif,
      num_seguridad_social: p.num_seguridad_social,
      medico_id: p.medico_id,
    }));
    res.json(pacientes);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
});

// Leer un paciente por ID
app.get("/api/pacientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Pacientes WHERE paciente_id = $1;",
      [id]
    );
    if (result.rows.length > 0) {
      const p = result.rows[0];
      res.json({
        paciente_id: p.paciente_id,
        nombre: p.nombre,
        direccion: p.direccion,
        telefono: p.telefono,
        codigo_postal: p.codigo_postal,
        nif: p.nif,
        num_seguridad_social: p.num_seguridad_social,
        medico_id: p.medico_id,
      });
    } else {
      res.status(404).json({ error: "Paciente no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener paciente:", error);
    res.status(500).json({ error: "Error al obtener paciente" });
  }
});

// Obtener empleados que son médicos
app.get("/api/empleados/medicos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Empleados WHERE tipo_empleado = 'medico';"
    );
    const medicos = result.rows.map((e) => ({
      empleado_id: e.empleado_id,
      nombre: e.nombre,
      direccion: e.direccion,
      telefono: e.telefono,
      tipo_empleado: e.tipo_empleado,
    }));
    res.json(medicos);
  } catch (error) {
    console.error("Error al obtener médicos:", error);
    res.status(500).json({ error: "Error al obtener médicos" });
  }
});

// Actualizar un paciente
app.put("/api/pacientes/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    direccion,
    telefono,
    codigoPostal,
    nif,
    numSeguridadSocial,
    medicoId,
  } = req.body;

  // Crear un objeto para almacenar solo los valores proporcionados
  const updates = {};
  if (nombre) updates.nombre = nombre;
  if (direccion) updates.direccion = direccion;
  if (telefono) updates.telefono = telefono;
  if (codigoPostal) updates.codigo_postal = codigoPostal;
  if (nif) updates.nif = nif;
  if (numSeguridadSocial) updates.num_seguridad_social = numSeguridadSocial;
  if (medicoId) updates.medico_id = medicoId;

  // Generar la consulta dinámicamente
  const fields = Object.keys(updates)
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updates);

  try {
    if (fields.length === 0) {
      return res
        .status(400)
        .json({ error: "No se enviaron campos para actualizar" });
    }

    // Agregar el ID al final de los valores
    values.push(id);

    const query = `UPDATE Pacientes SET ${fields} WHERE paciente_id = $${values.length};`;

    await pool.query(query, values);
    res.json({ message: "Paciente actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    res.status(500).json({ error: "Error al actualizar paciente" });
  }
});


// Eliminar un paciente
app.delete("/api/pacientes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM Pacientes WHERE paciente_id = $1;", [id]);
    res.json({ message: "Paciente eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    res.status(500).json({ error: "Error al eliminar paciente" });
  }
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
