import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { servicioAutenticacion } from "./autenticacion.service";
import "./autenticacion.css";
import logoPronavid from "../../images/Logopronavid.png";

export default function Registro() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        tipoDoc: "CC",
        numDoc: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
        rol: "Asesor",
        codigoAdmin: ""
    });

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const obtenerIdRol = () => formData.rol === "Administrador" ? 1 : 2;

    const validarFormulario = () => {
        if (!formData.nombre.trim()) {
            setMensaje("El nombre es requerido");
            setTipoMensaje("error");
            return false;
        }
        if (!formData.apellido.trim()) {
            setMensaje("El apellido es requerido");
            setTipoMensaje("error");
            return false;
        }
        if (!formData.numDoc.trim()) {
            setMensaje("El número de documento es requerido");
            setTipoMensaje("error");
            return false;
        }
        if (!formData.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            setMensaje("Ingresa un correo electrónico válido");
            setTipoMensaje("error");
            return false;
        }
        if (formData.contrasena.length < 6) {
            setMensaje("La contraseña debe tener al menos 6 caracteres");
            setTipoMensaje("error");
            return false;
        }
        if (formData.contrasena !== formData.confirmarContrasena) {
            setMensaje("Las contraseñas no coinciden");
            setTipoMensaje("error");
            return false;
        }
        if (formData.rol === "Administrador" && formData.codigoAdmin !== "admin123") {
            setMensaje("Código de administrador incorrecto");
            setTipoMensaje("error");
            return false;
        }
        return true;
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (!validarFormulario()) return;

        setCargando(true);

        try {
            await servicioAutenticacion.register({
                primer_nombre: formData.nombre,
                primer_apellido: formData.apellido,
                tipo_documento: formData.tipoDoc,
                numero_documento: formData.numDoc,
                correo: formData.correo,
                contrasena: formData.contrasena,
                id_rol: obtenerIdRol(),
            });

            setMensaje("¡Registro exitoso! Redirigiendo...");
            setTipoMensaje("success");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            console.error("Error:", err);
            setMensaje(err.message || "Error al registrar");
            setTipoMensaje("error");
            setCargando(false);
        }
    };

    return (
        <div className="auth-page">
            <header className="encabezado">
                <img src={logoPronavid} alt="Logo Pronavid" className="logo" />
            </header>

            <main className="contenedor">
                <div className="glass-card fade-in registro-card">
                    <form onSubmit={handleRegistro} className="formulario">
                        <h2>Crear Cuenta</h2>
                        <p className="subtitulo">Completa el formulario para registrarte</p>

                        <div className="form-row">
                            <div className="input-group">
                                <label className="input-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="input"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Tu nombre"
                                    disabled={cargando}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    className="input"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="Tu apellido"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        <div className="form-row registro-row-doc">
                            <div className="input-group">
                                <label className="input-label">Tipo Doc.</label>
                                <select
                                    name="tipoDoc"
                                    className="input"
                                    value={formData.tipoDoc}
                                    onChange={handleChange}
                                    disabled={cargando}
                                >
                                    <option value="CC">Cédula</option>
                                    <option value="TI">Tarjeta ID</option>
                                    <option value="CE">Cédula Ext.</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Número de documento</label>
                                <input
                                    type="text"
                                    name="numDoc"
                                    className="input"
                                    value={formData.numDoc}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="correo"
                                className="input"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="ejemplo@correo.com"
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label className="input-label">Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    className="input"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    disabled={cargando}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Confirmar</label>
                                <input
                                    type="password"
                                    name="confirmarContrasena"
                                    className="input"
                                    value={formData.confirmarContrasena}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Tipo de cuenta</label>
                            <select
                                name="rol"
                                className="input"
                                value={formData.rol}
                                onChange={handleChange}
                                disabled={cargando}
                            >
                                <option value="Asesor">Asesor</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>

                        {formData.rol === "Administrador" && (
                            <div className="input-group">
                                <label className="input-label">Código de administrador</label>
                                <input
                                    type="password"
                                    name="codigoAdmin"
                                    className="input"
                                    value={formData.codigoAdmin}
                                    onChange={handleChange}
                                    placeholder="Ingresa el código secreto"
                                    disabled={cargando}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={cargando}
                        >
                            {cargando ? (
                                <>
                                    <span className="loader-inline"></span>
                                    Registrando...
                                </>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </button>

                        {mensaje && (
                            <div className={`mensaje ${tipoMensaje}`}>
                                {tipoMensaje === "success" ? "✓" : "!"} {mensaje}
                            </div>
                        )}

                        <div className="auth-footer">
                            <Link to="/login" className="auth-link">
                                ¿Ya tienes cuenta? <span>Inicia sesión</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
