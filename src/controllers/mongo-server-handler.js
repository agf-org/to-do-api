const mongoose = require('mongoose')

module.exports.connect = async () => {
  const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/notebook`
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  console.log(`Connecting to ${mongoUri}`)
  const connectWithRetry = async () => {
    await mongoose.connect(mongoUri, mongooseOpts).then(() => {
      console.log('Connected to MongoDB successfully!')
    }).catch(error => {
      console.log('Connection to MongoDB failed. Retrying after 5 seconds...')
      setTimeout(connectWithRetry, 5000)
    })
  }
  await connectWithRetry()
}
