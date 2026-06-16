import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

// Note: For Vercel deployment, you would swap this for @vercel/postgres or similar cloud DB.
const dbPath = path.join(process.cwd(), "sqlite.db");
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
