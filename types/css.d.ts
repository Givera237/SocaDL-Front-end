// Permet à TypeScript d'accepter les imports CSS venant de node_modules
// (ex: import "leaflet/dist/leaflet.css";) sans déclaration de type dédiée.
declare module "*.css";