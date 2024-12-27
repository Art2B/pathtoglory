import pg from "pg";

const { Client } = pg;

const client = new Client({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  hostname: process.env.POSTGRES_HOSTNAME,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});
await client.connect();

client.on("error", (err) => {
  console.error("[PG Client] something bad has happened!", err.stack);
});

export default client;
