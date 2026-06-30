import { 
    ShoppingBag, 
    Users, 
    TrendingUp, 
    BarChart3, 
    ClipboardList, 
    Trophy 
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./panel.css";
import CabeceraPanel from "./CabeceraPanel";
import PiePanel from "./PiePanel";
import Tarjeta from "../../compartido/components/Tarjeta";

export default function DashboardAdmin() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userRaw = localStorage.getItem("usuario");
        if (!userRaw) {
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(userRaw);
            if (user.id_rol !== 1) {
                navigate("/DashboardAsesor");
                return;
            }
            setUsuario(user);
        } catch (e) {
            navigate("/login");
        }
    }, [navigate]);

    if (!usuario) return null;

    return (
        <>
            <CabeceraPanel rol="Administrador" perfilLink="/perfil" />

            <section className="titulo-panel">
                <h2>Panel Administrativo</h2>
                <p>Bienvenido, {usuario.primer_nombre} {usuario.primer_apellido}</p>
            </section>

            <main className="dashboard-panel">
                <Tarjeta
                    to="/catalogo"
                    icono={ShoppingBag}
                    titulo="Catálogo"
                    descripcion="Editar productos disponibles"
                />
                <Tarjeta
                    to="/clientes"
                    icono={Users}
                    titulo="Clientes"
                    descripcion="Gestionar base de clientes"
                />
                <Tarjeta
                    to="/seguimiento-admin"
                    icono={TrendingUp}
                    titulo="Pedidos"
                    descripcion="Control y estado de pedidos"
                />
                <Tarjeta
                    to="/ReporteBasico?tab=graficos"
                    icono={BarChart3}
                    titulo="Métricas"
                    descripcion="Ver estadísticas de rendimiento"
                />
                <Tarjeta
                    to="/ReporteBasico?tab=historial"
                    icono={ClipboardList}
                    titulo="Historial"
                    descripcion="Ver historial total de ventas"
                />
                <Tarjeta
                    to="/ReporteBasico?tab=frecuente"
                    icono={Trophy}
                    titulo="Top Desempeño"
                    descripcion="Mejores clientes y productos"
                />
            </main>

            <PiePanel />
        </>
    );
}
