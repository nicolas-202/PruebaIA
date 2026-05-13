# Inventario de Pedidos

Pequeña aplicación para registrar pedidos desde el celular usando Firebase y Google Sign-In.

## Instalación

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un proyecto en Firebase Console.
3. Añade una aplicación web y copia el fragmento de configuración que Firebase te ofrece.
4. Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales reales usando este formato:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```
5. En Firebase Console > Authentication > Sign-in method, habilita Google.
6. En Authentication > Settings, agrega `localhost` (y `127.0.0.1` si usas ese host) como dominio autorizado.
7. Crea una base de datos Firestore en modo de prueba o con las reglas que necesites.
8. Inicia la app:
   ```bash
   npm run dev
   ```

## Uso

- Inicia sesión con tu correo de Google.
- Registra pedidos con producto, cantidad y nota.
- Verás la lista de pedidos actualizada en tiempo real.

## Notas

- Si ves un error al iniciar sesión, revisa que las variables `VITE_FIREBASE_*` estén definidas en `.env`.
- Si pruebas en local, tu dominio autorizado debe incluir `localhost`.
