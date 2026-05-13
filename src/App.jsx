import { useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { auth, provider, db } from './firebase.js';

function App() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
      setLoading(false);
    });

    return () => unsubscribeOrders();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error login:', error);
      alert(`Error al iniciar sesión con Google: ${error.message}`);
    }
  };

  const userName = user?.displayName || user?.email || 'Usuario';

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddOrder = async (event) => {
    event.preventDefault();
    if (!product.trim() || Number(quantity) <= 0) {
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        product: product.trim(),
        quantity: Number(quantity),
        note: note.trim(),
        userName: user.displayName || user.email,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setProduct('');
      setQuantity('1');
      setNote('');
    } catch (error) {
      console.error('Error adding order:', error);
      alert('No se pudo guardar el pedido.');
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('No se pudo eliminar el pedido.');
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Inventario de Pedidos</h1>
          <p>Registra pedidos desde tu celular y sincroniza con Firebase.</p>
        </div>
        {user ? (
          <button className="button secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : null}
      </header>

      {!user ? (
        <main className="card center-card">
          <h2>Inicia sesión con Google</h2>
          <button className="button" onClick={handleGoogleLogin}>
            Iniciar con Google
          </button>
        </main>
      ) : (
        <main className="content-grid">
          <section className="card form-card">
            <h2>Nuevo pedido</h2>
            <form onSubmit={handleAddOrder}>
              <label>
                Producto
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="Nombre del producto"
                />
              </label>
              <label>
                Cantidad
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </label>
              <label>
                Nota
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Opcional"
                />
              </label>
              <button className="button" type="submit">
                Guardar pedido
              </button>
            </form>
          </section>

          <section className="card list-card">
            <div className="list-header">
              <div>
                <h2>Pedidos registrados</h2>
                <p>{orders.length} pedido(s)</p>
              </div>
              <span>{userName}</span>
            </div>

            {loading ? (
              <p>Cargando pedidos...</p>
            ) : orders.length === 0 ? (
              <p>No tienes pedidos registrados.</p>
            ) : (
              <ul className="order-list">
                {orders.map((order) => (
                  <li key={order.id} className="order-item">
                    <div>
                      <strong>{order.product}</strong>
                      <p>{order.note || 'Sin nota'}</p>
                      <small>Pedido de: {order.userName || order.userEmail || 'Anónimo'}</small>
                    </div>
                    <div className="order-meta">
                      <span>Cantidad: {order.quantity}</span>
                      <span>
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleString()
                          : 'Fecha no disponible'}
                      </span>
                      <button
                        className="button small"
                        onClick={() => handleDelete(order.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
