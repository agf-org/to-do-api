const mongoose = require('mongoose')

module.exports.connect = async () => {
  const mongoUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  await mongoose.connect(mongoUri, mongooseOpts)
}
