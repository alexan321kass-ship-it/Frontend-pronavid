import { useState, useEffect } from "react";
import "../styles/navbar.css";
import logoPronavid from "../../images/Logopronavid.png";
import { Bell } from "lucide-react";
import api from "../../config/api";

export default function BarraPronavid() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [noLeidas, setNoLeidas] = useState(0);
    const [mostrarLista, setMostrarLista] = useState(false);

    const cargarNotificaciones = async () => {
        try {
            const data = await api.get("/notificaciones?limite=5");
            if (data && data.notificaciones) {
                setNotificaciones(data.notificaciones);
                // Si el backend no devuelve un conteo real, contamos temporalmente las que tenemos
                setNoLeidas(data.notificaciones.length); 
            }
        } catch (error) {
            console.error("Error cargando notificaciones", error);
        }
    };

    useEffect(() => {
        cargarNotificaciones();
        const intervalo = setInterval(cargarNotificaciones, 15000); // Polling cada 15s
        return () => clearInterval(intervalo);
    }, []);

    const toggleLista = () => {
        setMostrarLista(!mostrarLista);
        if (noLeidas > 0) setNoLeidas(0); // Simulamos marcarlas como vistas
    };

    return (
        <nav className="nav" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
            <img
                src={logoPronavid}
                alt="Pronavid"
                className="nav-logo"
            />
            <div style={{ position: "relative" }}>
                <button onClick={toggleLista} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
                    <Bell color="white" size={24} />
                    {noLeidas > 0 && (
                        <span style={{ position: "absolute", top: -5, right: -5, background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "12px", fontWeight: "bold" }}>
                            {noLeidas}
                        </span>
                    )}
                </button>
                {mostrarLista && (
                    <div style={{ position: "absolute", top: "100%", right: 0, width: "300px", background: "white", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 1000, overflow: "hidden" }}>
                        <div style={{ padding: "10px", background: "#f3f4f6", fontWeight: "bold", borderBottom: "1px solid #ddd", color: "black" }}>Notificaciones recientes</div>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {notificaciones.length > 0 ? (
                                notificaciones.map(n => (
                                    <div key={n.id_notificacion} style={{ padding: "10px", borderBottom: "1px solid #eee", fontSize: "14px", color: "#333" }}>
                                        <strong>Pedido #{n.id_pedido}</strong>: {n.mensaje}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "10px", textAlign: "center", color: "#777" }}>Sin notificaciones</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
