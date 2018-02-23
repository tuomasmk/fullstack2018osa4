const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
 
blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.title === undefined || body.author === undefined || body.url === undefined) {
      return response.status(400).json({ error: 'title, author or url missing' })
    }
      
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    response.json(formatBlog(savedBlog))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id
    await Blog.findByIdAndRemove(id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const likes = request.body.likes
    
    const updatedBlog = await Blog.findById(id)
    if (likes >= 0) {
      updatedBlog.likes = likes
    } else {
      return response.status(400).json({ error: 'likes cannot be negative' })
    }
    await Blog.findByIdAndUpdate(updatedBlog)
    
    response.json(formatBlog(updatedBlog))
  }catch(exception) {
    console.log(exception)
    response.status(400).json({ error: 'malformatted id' })
  }
})

const formatBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id
  }
}

module.exports = blogsRouter