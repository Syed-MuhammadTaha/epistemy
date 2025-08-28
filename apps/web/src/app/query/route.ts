import postgres from 'postgres';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' }) as any;


