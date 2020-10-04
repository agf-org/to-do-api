const mongoose = require('mongoose')

module.exports.connect = async () => {
  const mongoUri = `mongodb://mongo:27017/notebook`
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  await mongoose.connect(mongoUri, mongooseOpts)
}
