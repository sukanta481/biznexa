import IntegrationsClient from '@/components/admin/IntegrationsClient';
import { isEncryptionConfigured, mask } from '@/lib/crypto-box';
import {
  getIntegrationConfig,
  getStoredConfig,
  getVerificationState,
  type Provider,
} from '@/lib/integrations';

export const runtime = 'nodejs';

const PROVIDERS: Provider[] = ['whatsapp', 'smtp', 's3'];

const PROVIDER_FIELDS: Record<Provider, readonly string[]> = {
  whatsapp: ['token', 'phoneNumberId', 'ingestSecret'],
  smtp: ['host', 'port', 'user', 'pass', 'secure', 'fromEmail', 'notificationEmail'],
  s3: ['bucket', 'region', 'accessKeyId', 'secretAccessKey', 'endpoint', 'forcePathStyle', 'publicBase'],
};

const SECRET_FIELDS: Record<Provider, readonly string[]> = {
  whatsapp: ['token', 'ingestSecret'],
  smtp: ['pass'],
  s3: ['secretAccessKey'],
};

export default async function IntegrationsPage() {
  const providers = await Promise.all(
    PROVIDERS.map(async (provider) => {
      const [resolved, stored] = await Promise.all([
        getIntegrationConfig(provider),
        getStoredConfig(provider),
      ]);
      const verification = await getVerificationState(provider);
      const fields: Record<string, { set: boolean; preview?: string; value?: string; source: 'database' | 'env' | 'unset' }> = {};

      for (const key of PROVIDER_FIELDS[provider]) {
        const value = resolved[key] ?? '';
        const storedValue = stored[key] ?? '';
        const fromDb = storedValue.trim().length > 0;
        const fromEnv = value.trim().length > 0;
        const isSecret = SECRET_FIELDS[provider].includes(key);
        const source: 'database' | 'env' | 'unset' = fromDb ? 'database' : fromEnv ? 'env' : 'unset';

        const meta: { set: boolean; preview?: string; value?: string; source: 'database' | 'env' | 'unset' } = {
          set: fromDb || fromEnv,
          source,
        };
        if (isSecret) meta.preview = mask(value);
        else meta.value = value;
        fields[key] = meta;
      }

      return {
        provider,
        fields,
        lastVerifiedAt: verification?.last_verified_at ?? null,
        verifyError: verification?.verify_error ?? null,
        updatedAt: verification?.updated_at ?? null,
      };
    }),
  );

  const initial = {
    ok: true,
    encryptionConfigured: isEncryptionConfigured(),
    providers,
  };

  return <IntegrationsClient initial={initial} />;
}
