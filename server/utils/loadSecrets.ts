import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Crea una instancia del cliente de Secret Manager
const client = new SecretManagerServiceClient();

// Función para obtener un secreto
async function getSecret(secretName: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: secretName,
  });

  // Retorna el valor del secreto como una cadena
  return version.payload?.data?.toString() || '';
}

// Función principal para cargar los secretos
export async function loadSecrets() {
  try {
    // Obtén los secretos desde el Secret Manager
    process.env.FIREBASE_API_KEY = await getSecret(
      'projects/sozu-admin-dev/secrets/FIREBASE_API_KEY/versions/latest'
    );
    process.env.FIREBASE_AUTH_DOMAIN = await getSecret(
      'projects/sozu-admin-dev/secrets/FIREBASE_AUTH_DOMAIN/versions/latest'
    );
    process.env.FIREBASE_PROJECT_ID = await getSecret(
      'projects/sozu-admin-dev/secrets/FIREBASE_PROJECT_ID/versions/latest'
    );
    process.env.FIREBASE_STORAGE_BUCKET = await getSecret(
      'projects/sozu-admin-dev/secrets/FIREBASE_STORAGE_BUCKET/versions/latest'
    );
    process.env.FIREBASE_MESSAGING_SENDER_ID = await getSecret(
      'projects/sozu-admin-dev/secrets/FIREBASE_MESSAGING_SENDER_ID/versions/latest'
    );
    process.env.FIREBASE_APP_ID = await getSecret(
      'projects/sozu-admin-dev/secrets/FIREBASE_APP_ID/versions/latest'
    );

    console.log('Secretos cargados correctamente.');
  } catch (error) {
    console.error('Error al cargar los secretos:', error);
  }
}

// Ejecuta la función para cargar los secretos
//loadSecrets();