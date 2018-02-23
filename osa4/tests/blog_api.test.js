const supertest = require('supertest')
const { app, server } = require('../src/index')
const api = supertest(app)
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

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api
    .get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
})

test('the first blog is about HTTP methods', async () => {
  const response = await api
    .get('/api/blogs')

  expect(response.body[0].author).toBe('Maarit')
})

test('blog can be added', async () => {
  const newBlog = {
    title: 'idealista',
    author: 'Jenni Hussi',
    url: 'https://www.idealista.fi/jannihussi/'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const authors = response.body.map(r => r.author)

  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(authors).toContainEqual('Jenni Hussi')
})

test('Likes is 0 if no value was provided', async () => {
  const newBlog = {
    title: 'kemikaalicocktail',
    author: 'Noora',
    url: 'http://www.kemikaalicocktail.fi/blogi/'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const kemikaalicocktail = response.body.filter(r => r.title === 'kemikaalicocktail')

  expect(response.body.length).toBe(initialBlogs.length + 2)
  expect(kemikaalicocktail.length).toBe(1)
  expect(kemikaalicocktail[0].likes).toBe(0)
})

test('blog without title, author and url cannot be added', async () => {
  const newBlog = {
    likes: 100
  }

  const initialBlogs = await api
    .get('/api/blogs')

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api 
    .get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.body.length)
})

afterAll(() => {
  server.close()
})
