import { useEffect, useState } from "react";
import { FiEdit2, FiCheck } from "react-icons/fi";

function ModalPerfil({ mostrar, cerrarModal }) {
  // Estado inicial vacío - se llenará con datos del localStorage
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: "",
    correo: "",
    edad: "",
    telefono: "",
    contrasena: "",
  });
  const [respaldoDatos, setRespaldoDatos] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (mostrar) {
      cargarDatosUsuario();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mostrar]);

  const cargarDatosUsuario = () => {
    setCargando(true);
    try {
      // Obtener usuario del localStorage (donde se guardó al hacer login)
      const usuarioGuardado = localStorage.getItem("usuario");

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);

        const datosUsuario = {
          nombre: usuario.nombre || "",
          correo: usuario.correo || "",
          edad: usuario.edad || "",
          telefono: usuario.telefono || "",
          contrasena: "", // No cargar contraseña por seguridad
        };

        setDatosPerfil(datosUsuario);
        setRespaldoDatos(datosUsuario);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosPerfil({
      ...datosPerfil,
      [name]: value,
    });
  };

  const activarEdicion = () => {
    setRespaldoDatos({ ...datosPerfil });
    setModoEdicion(true);
  };

  // ✅ IMPORTANTE: AGREGAR async AQUÍ
  const manejarGuardar = async (e) => {
    e.preventDefault();

    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

      if (!usuario || !usuario._id) {
        console.error("No hay usuario logueado");
        return;
      }

      const datosActualizar = { ...datosPerfil };
      if (!datosActualizar.contrasena) {
        delete datosActualizar.contrasena;
      }

      // ✅ CAMBIO IMPORTANTE: Usar usuarioID en lugar de id
      const url = `http://localhost:3000/EditarUsuario/${usuario._id}`;
      console.log("URL:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizar),
      });

      if (response.ok) {
        const usuarioActualizado = await response.json();

        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        window.dispatchEvent(new Event('usuarioActualizado'));

        setDatosPerfil({
          nombre: usuarioActualizado.nombre || "",
          correo: usuarioActualizado.correo || "",
          edad: usuarioActualizado.edad || "",
          telefono: usuarioActualizado.telefono || "",
          contrasena: "",
        });
        setRespaldoDatos({
          nombre: usuarioActualizado.nombre || "",
          correo: usuarioActualizado.correo || "",
          edad: usuarioActualizado.edad || "",
          telefono: usuarioActualizado.telefono || "",
          contrasena: "",
        });

        setModoEdicion(false);
        alert("✅ Perfil actualizado exitosamente");
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message || "No se pudo actualizar"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  const manejarCancelar = () => {
    setDatosPerfil({ ...respaldoDatos });
    setModoEdicion(false);
  };

  const manejarCerrar = () => {
    setDatosPerfil({ ...respaldoDatos });
    setModoEdicion(false);
    cerrarModal();
  };

  if (!mostrar) return null;

  if (cargando) {
    return (
      <div
        onClick={manejarCerrar}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "1rem",
            textAlign: "center",
          }}>
          Cargando perfil...
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={manejarCerrar}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 99999,
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "650px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "24px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.18)",
          position: "relative",
          zIndex: 100000,
        }}>
        <div
          className="px-5 pt-5 pb-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(109, 40, 217, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
          }}>
          <div className="text-center">
            <div
              className="mx-auto d-flex align-items-center justify-content-center mb-4"
              style={{
                width: "100px",
                height: "100px",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                borderRadius: "50%",
                color: "white",
                fontSize: "48px",
                fontWeight: "bold",
                boxShadow: "0 10px 25px rgba(109, 40, 217, 0.25)",
                border: "4px solid white",
              }}>
              {datosPerfil.nombre?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h4 className="fw-bold mb-1 text-morado">Mi Perfil</h4>
            <p className="text-muted mb-0 small">
              Gestiona tu información personal
            </p>
          </div>

          <button
            type="button"
            onClick={manejarCerrar}
            aria-label="Cerrar"
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              border: "none",
              background: "transparent",
              fontSize: "34px",
              lineHeight: "1",
              color: "#6b7280",
              cursor: "pointer",
            }}>
            ×
          </button>
        </div>

        <div className="px-5 py-4">
          <form onSubmit={manejarGuardar}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-4"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  value={datosPerfil.nombre}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg rounded-4"
                  name="correo"
                  placeholder="Ingrese su correo"
                  value={datosPerfil.correo}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Edad</label>
                <input
                  type="number"
                  className="form-control form-control-lg rounded-4"
                  name="edad"
                  placeholder="Edad"
                  value={datosPerfil.edad}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-4"
                  name="telefono"
                  placeholder="Teléfono"
                  value={datosPerfil.telefono}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-4"
                  name="contrasena"
                  placeholder={
                    modoEdicion ? "Nueva contraseña (opcional)" : "••••••••"
                  }
                  value={datosPerfil.contrasena}
                  onChange={manejarCambio}
                  disabled={!modoEdicion}
                />
                {!modoEdicion && datosPerfil.nombre && (
                  <small className="text-muted">
                    Para cambiar la contraseña, haz clic en Editar Perfil
                  </small>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              {!modoEdicion ? (
                <>
                  <button
                    type="button"
                    className="btn btn-light px-4 py-2 rounded-4"
                    onClick={manejarCerrar}>
                    Cerrar
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2 rounded-4 d-flex align-items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault(); // ← Prevenir cualquier comportamiento por defecto
                      e.stopPropagation(); // ← Detener propagación del evento
                      activarEdicion();
                    }}>
                    <FiEdit2 size={18} />
                    Editar Perfil
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-light px-4 py-2 rounded-4"
                    onClick={manejarCancelar}>
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 rounded-4 d-flex align-items-center gap-2">
                    <FiCheck size={18} />
                    Guardar Cambios
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalPerfil;
