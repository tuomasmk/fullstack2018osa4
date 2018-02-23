const Blog = require('../models/blog')

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

const format = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    id: blog._id
  }
}

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(format)
}

module.exports = {
  initialBlogs, format, nonExistingId, blogsInDb
}