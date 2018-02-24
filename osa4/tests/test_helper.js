const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'sopusointuja',
    author: 'Maarit',
    url: 'http://sopusointuja.blogspot.fi/'
  },
  {
    title: 'saraparikka',
    author: 'Sara Parikka',
    url: 'https://anna.fi/sara-parikka/'
  }
]

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog.format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}