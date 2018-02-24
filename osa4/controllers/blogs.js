const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined || body.author === undefined || body.url === undefined) {
      return response.status(400).json({ error: 'title, author or url missing' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(Blog.format(savedBlog))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(id)

    if(blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(id)
      response.status(204).end()
    } else {
      response.status(400).json({ error: 'One can delete only his/her own blogs' })
    }

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

    response.json(Blog.format(updatedBlog))
  }catch(exception) {
    console.log(exception)
    response.status(400).json({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter