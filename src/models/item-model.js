const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
  page: {type: Schema.Types.ObjectId, ref: 'PageModel', required: true},
  text: {type: String, required: true},
  done: {type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('ItemModel', itemSchema)
