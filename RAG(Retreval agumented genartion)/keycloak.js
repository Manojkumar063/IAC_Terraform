import Keycloak from "keycloak-connect";
import session from "express-session";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

export function setupKeycloak(app) {
  const memoryStore = new session.MemoryStore();

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "keyboard cat",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

  const keycloak = new Keycloak(
    { store: memoryStore },
    path.join(__dirname, "keycloak-config.json")
  );

  app.use(keycloak.middleware());

  return keycloak;
}
