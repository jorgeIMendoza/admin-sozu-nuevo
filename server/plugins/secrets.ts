import { loadSecrets } from '../utils/loadSecrets';

export default defineNitroPlugin(async () => {
  await loadSecrets();
});
