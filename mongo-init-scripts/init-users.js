db = db.getSiblingDB("fidesinnova");

db.createUser({
  user: process.env.FIDESINNOVA_DB_USERNAME,
  pwd: process.env.FIDESINNOVA_DB_PASSWORD,
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }],
});
