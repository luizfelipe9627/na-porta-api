import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Arquivo de configuração do Prisma, definindo o caminho do schema, das migrações e a URL do datasource a partir das variáveis de ambiente.
export default defineConfig({
  // Define o caminho do arquivo de schema do Prisma
  schema: 'prisma/schema.prisma',
  // Define o caminho das migrações do Prisma
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // Define a URL do datasource a partir das variáveis de ambiente
  datasource: {
    url: env('DATABASE_URL'),
  },
});
