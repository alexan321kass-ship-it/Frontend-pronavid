import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import "../../compartido/styles/seguimiento-compartido.css";
import "./pedidos.css";

// Componentes modulares
import FiltrosCategorias from "./FiltrosCategorias";
import GridProductos from "./GridProductos";
import PanelCarrito from "./PanelCarrito";
import SelectorCliente from "./SelectorCliente";
import logoPronavid from "../../images/Logopronavid.png";

export default function Pedidos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Validación de acceso por rol
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("usuario"));
      if (!user || (user.id_rol !== 1 && user.id_rol !== 2)) {
        navigate("/login", { replace: true });
      }
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const { api } = await import("../../config/api");

      const dataProductos = await api.get("/productos");
      setProductos(dataProductos.productos || []);

      const cats = [...new Set(dataProductos.productos?.map(p => p.nombre_categoria) || [])];
      setCategorias(cats);

      const dataClientes = await api.get("/clientes");
      setClientes(dataClientes.clientes || []);

    } catch (err) {
      console.error("Error cargando datos:", err);
      setMensaje({ texto: "Error al cargar datos", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  // Carga inicial de catálogo y clientes
  useEffect(() => {
    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter(p => {
    const matchCategoria = !categoriaActual || p.nombre_categoria === categoriaActual;
    const matchBusqueda = !busqueda ||
      p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id_producto === producto.id_producto);
      if (existe) {
        return prev.map(item =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    if (!mostrarCarrito) setMostrarCarrito(true);
  };

  const modificarCantidad = (id_producto, delta) => {
    setCarrito(prev =>
      prev.map(item => {
        if (item.id_producto === id_producto) {
          const nuevaCantidad = Math.max(1, item.cantidad + delta);
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
    );
  };

  const eliminarDelCarrito = (id_producto) => {
    setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
  };

  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(precio);
  };

  const exportarCotizacion = () => {
    if (!clienteSeleccionado) {
      setMensaje({ texto: "Selecciona un cliente primero", tipo: "error" });
      return;
    }
    if (carrito.length === 0) {
      setMensaje({ texto: "El carrito está vacío", tipo: "error" });
      return;
    }

    const cliente = clientes.find(c => c.id_cliente == clienteSeleccionado);
    const fecha = new Date().toLocaleDateString("es-CO", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const total = calcularTotal();
    const iva = total * 0.19;
    const totalConIva = total + iva;

    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Cotización - PRONAVID</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #C0392B; padding-bottom: 20px; }
                    .logo-section h1 { color: #C0392B; font-size: 28px; margin-bottom: 5px; }
                    .logo-section p { color: #666; font-size: 14px; }
                    .cotizacion-info { text-align: right; }
                    .cotizacion-info h2 { font-size: 24px; color: #333; margin-bottom: 10px; }
                    .cotizacion-info p { font-size: 14px; color: #666; }
                    .cliente-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                    .cliente-section h3 { color: #C0392B; margin-bottom: 15px; font-size: 16px; }
                    .cliente-section p { margin: 5px 0; font-size: 14px; }
                    .cliente-section strong { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th { background: #C0392B; color: white; padding: 12px; text-align: left; font-size: 14px; }
                    td { padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; }
                    tr:nth-child(even) { background: #f9f9f9; }
                    .totales { text-align: right; margin-top: 20px; }
                    .totales p { margin: 8px 0; font-size: 14px; }
                    .totales .total-final { font-size: 20px; font-weight: bold; color: #C0392B; border-top: 2px solid #C0392B; padding-top: 10px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-section">
                        <h1>🍞 PRONAVID</h1>
                        <p>Productos Naturales y Vida Saludable</p>
                    </div>
                    <div class="cotizacion-info">
                        <h2>COTIZACIÓN</h2>
                        <p><strong>Fecha:</strong> ${fecha}</p>
                    </div>
                </div>

                <div class="cliente-section">
                    <h3>DATOS DEL CLIENTE</h3>
                    <p><strong>Cliente:</strong> ${cliente?.nombre_cliente || 'N/A'}</p>
                    <p><strong>Identificación:</strong> ${cliente?.identificacion || 'N/A'}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${carrito.map(item => `
                            <tr>
                                <td>${item.nombre_producto}</td>
                                <td style="text-align: center">${item.cantidad}</td>
                                <td style="text-align: right">${formatearPrecio(item.precio)}</td>
                                <td style="text-align: right">${formatearPrecio(item.precio * item.cantidad)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="totales">
                    <p><strong>Subtotal:</strong> ${formatearPrecio(total)}</p>
                    <p><strong>IVA (19%):</strong> ${formatearPrecio(iva)}</p>
                    <p class="total-final"><strong>TOTAL:</strong> ${formatearPrecio(totalConIva)}</p>
                </div>
            </body>
            </html>
        `;

    const ventana = window.open('', '_blank');
    ventana.document.write(htmlContent);
    ventana.document.close();
    setTimeout(() => { ventana.print(); }, 500);

    setMensaje({ texto: "Cotización generada correctamente", tipo: "success" });
  };

  const enviarPedido = async () => {
    if (!clienteSeleccionado || carrito.length === 0) return;
    setEnviando(true);
    try {
      const user = JSON.parse(localStorage.getItem("usuario"));
      const { api } = await import("../../config/api");
      const pedidoData = {
        id_cliente: parseInt(clienteSeleccionado.id_cliente),
        id_usuario: user?.id_usuario || 1,
        productos: carrito.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: parseFloat(item.precio)
        }))
      };
      const data = await api.post("/pedidos", pedidoData);
      setMensaje({ texto: `¡Pedido #${data.id_pedido} creado exitosamente!`, tipo: "success" });
      setCarrito([]);
      setClienteSeleccionado(null);
      setMostrarCarrito(false);
      // Actualizar existencias tras pedido
      await cargarDatos();
    } catch (error) {
      setMensaje({ texto: error.message || "Error al enviar pedido", tipo: "error" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="seguimiento-page pedidos-pagina">
      <header className="seg-header">
        <img src={logoPronavid} alt="Pronavid" className="seg-logo" />
      </header>

      <button onClick={() => navigate("/DashboardAsesor")} className="btn-volver" title="Volver">
        <ChevronLeft size={24} />
      </button>

      {/* Botón Carrito Flotante */}
      <AnimatePresence>
        {!mostrarCarrito && (
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMostrarCarrito(true)}
                className="boton-carrito-flotante"
            >
                <ShoppingCart size={28} />
                {carrito.length > 0 && (
                    <span className="boton-carrito-flotante__badge">
                        {carrito.length}
                    </span>
                )}
            </motion.button>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <div className={`pedidos-contenido ${mostrarCarrito ? "pedidos-contenido--con-carrito" : ""}`}>
        <div>
            <div className="seg-card seg-card--entrada">
            <div className="seg-card-header">
                <h2 className="pedidos-titulo-icono">
                    <ShoppingCart size={28} color="var(--color-primary)" /> 
                    Crear Nuevo Pedido
                </h2>
            </div>

            <div className="pedidos-seccion-cliente">
                <SelectorCliente 
                    clientes={clientes}
                    clienteSeleccionado={clienteSeleccionado}
                    setClienteSeleccionado={setClienteSeleccionado}
                />
            </div>

            <FiltrosCategorias
                categorias={categorias}
                categoriaActual={categoriaActual}
                setCategoriaActual={setCategoriaActual}
            />

            <AnimatePresence>
                {mensaje.texto && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`seg-mensaje ${mensaje.tipo}`}
                    >
                        {mensaje.texto}
                    </motion.div>
                )}
            </AnimatePresence>

            <GridProductos
                productos={productosFiltrados}
                agregarAlCarrito={agregarAlCarrito}
                formatearPrecio={formatearPrecio}
            />
            </div>
        </div>
      </div>

      <PanelCarrito
        carrito={carrito}
        setCarrito={setCarrito}
        clienteSeleccionado={clienteSeleccionado}
        formatearPrecio={formatearPrecio}
        onConfirmar={enviarPedido}
        onCotizar={exportarCotizacion}
        cargandoPedido={enviando}
        isOpen={mostrarCarrito}
        onClose={() => setMostrarCarrito(false)}
      />
    </div>
  );
}
