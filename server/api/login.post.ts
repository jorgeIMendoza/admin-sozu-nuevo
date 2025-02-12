import admin from 'firebase-admin';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Leer datos enviados desde el frontend
    console.log('BODY: ', body);
    console.log(JSON.stringify({ level: "info", message: "BODY", data: body }));


    const { idToken } = body;

    if (!idToken) {
      throw new Error('ID Token no proporcionado.');
    }

    console.log('Verificando ID Token...');
    // Inicializar firebase-admin si aún no está inicializado
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const auth = admin.auth();
    const db = admin.firestore();

    // Verificar el ID token del usuario
    const decodedToken = await auth.verifyIdToken(idToken);
    const email = decodedToken.email;

    console.log('Token verificado. Usuario: ', email);

    // Verificar si el usuario es interno o externo
    const isInternal = email.endsWith('@sozu.com');
    const rolId = isInternal ? 'interno' : 'externo';

    console.log(`Usuario identificado como: ${isInternal ? 'Interno' : 'Externo'}`);

    // Guardar/Actualizar el usuario en Firestore
    const userRef = db.collection('usuarios').doc(decodedToken.uid);
    await userRef.set(
      {
        nombre: decodedToken.name || '',
        email,
        rol: db.doc(`/roles/${rolId}`), // Referencia al documento del rol
      },
      { merge: true } // Actualiza solo campos proporcionados
    );

    console.log('Usuario guardado/actualizado en Firestore.');

    return {
      message: 'Usuario autenticado y guardado correctamente.',
      rol: rolId,
    };
  } catch (error: any) {
    console.error('Error en el proceso de login:', error);

    // Devolver error al cliente
    return {
      statusCode: 500,
      body: { message: error.message || 'Error desconocido en el servidor.' },
    };
  }
});
