const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer({binary: {version: '4.4.1'}});

module.exports.connect = async () => {
  const mongoUri = await mongoServer.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  await mongoose.connect(mongoUri, mongooseOpts);
}

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}
