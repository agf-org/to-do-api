const mongoose = require('mongoose')

module.exports.connect = async () => {
  const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/notebook`
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  await mongoose.connect(mongoUri, mongooseOpts)
}
