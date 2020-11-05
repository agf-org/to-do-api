const mongoose = require('mongoose')

module.exports.connect = async () => {
  const mongoUri = 'mongodb+srv://' +
    `${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/` +
    'notebook?' +
    'retryWrites=true&w=majority'
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  if (process.env.NODE_ENV === 'production') {
    console.log('Connecting to MongoDB')
  } else {
    console.log(`Connecting to ${mongoUri}`)
  }
  const connectWithRetry = async () => {
    await mongoose.connect(mongoUri, mongooseOpts).then(() => {
      console.log('Connected to MongoDB successfully!')
    }).catch(() => {
      console.log('Connection to MongoDB failed. Retrying after 5 seconds...')
      setTimeout(connectWithRetry, 5000)
    })
  }
  await connectWithRetry()
}
