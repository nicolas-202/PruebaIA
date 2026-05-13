# Inventario de Pedidos

Pequeña aplicación para registrar pedidos desde el celular usando Firebase y Google Sign-In.

## Instalación

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un proyecto en Firebase.
3. Habilita Authentication > Sign-in method > Google.
4. Crea una base de datos Firestore en modo de prueba.
5. Copia tus credenciales de Firebase en `src/firebase.js`.
6. Inicia la app:
   ```bash
   npm run dev
   ```

## Uso

- Inicia sesión con tu correo de Google.
- Registra pedidos con producto, cantidad y nota.
- Verás la lista de pedidos actualizada en tiempo real.

## Notas

En `src/firebase.js` debes reemplazar los valores de configuración con tus datos reales de Firebase.
