const mongoose = require('mongoose')

module.exports.connect = async () => {
  const mongoUri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/notebook`
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  await mongoose.connect(mongoUri, mongooseOpts)
}
