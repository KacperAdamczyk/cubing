declare module "*.sqlite" {
  import type { Database } from "bun:sqlite";
  const database: Database;
  export default database;
}
