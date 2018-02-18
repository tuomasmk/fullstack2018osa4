const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then( () => {
    console.log('connected to database', process.env.MONGODB_URI)
  })
  .catch( err => {
    console.log(err)
  })

mongoose.Promise = global.Promise

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog