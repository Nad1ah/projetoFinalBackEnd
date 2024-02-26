const { MongoClient, ObjectId } = require("mongodb");

let _db;

async function init() {
  const client = new MongoClient(process.env.DB_URL);
  const connection = await client.connect();
  _db = connection.db(process.env.DB_NAME);
}

function getDB() {
  return _db;
}

function toMongoID(id) {
  return new ObjectId(id);
}

module.exports = {
  init,
  getDB,
  toMongoID,
  usersCollection: "users",
  pollsCollection: "polls",
};
