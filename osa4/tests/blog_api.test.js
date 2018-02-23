const supertest = require('supertest')
const { app, server } = require('../src/index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')


describe('Showing db content', async() => {
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

  test('Author of the first blog is Maarit', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].author).toBe('Maarit')
  })
})

describe('Adding blogs', async() => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blog can be added', async () => {
    const blogsInDatabase = await blogsInDb()

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

    expect(response.body.length).toBe(blogsInDatabase.length + 1)
    expect(authors).toContainEqual('Jenni Hussi')
  })

  test('Likes is 0 if no value was provided', async () => {
    const blogsInDatabase = await blogsInDb()

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

    expect(response.body.length).toBe(blogsInDatabase.length + 1)
    expect(kemikaalicocktail.length).toBe(1)
    expect(kemikaalicocktail[0].likes).toBe(0)
  })

  test('blog without title, author and url cannot be added', async () => {
    const blogsInDatabase = await blogsInDb()

    const newBlog = {
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api 
      .get('/api/blogs')

    expect(response.body.length).toBe(blogsInDatabase.length)
  })
})

describe('deleting blogs', async() => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  
  test('deleting one blog succeeds', async() => {
    const blogsInDatabase = await blogsInDb()
    const blog = blogsInDatabase[0]

    await api
      .delete('/api/blogs/' + blog.id)
      .expect(204)

    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toBe(blogsInDatabase.length - 1)
  })

  test('deleting with false id causes error', async() => {
    const blogsInDatabase = await blogsInDb()

    await api
      .delete('/api/blogs/1')
      .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsInDatabase.length)
  })
})

describe('Modifying blogs', async() => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  
  test('Adding likes succeeds', async() => {
    const blogsInDatabase = await blogsInDb()
    const blog = blogsInDatabase[0]
    blog.likes = 5

    const response = await api
      .put('/api/blogs/' + blog.id)
      .send(blog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toBe(blogsInDatabase.length)
    expect(response.body.likes).toBe(5)
  })

  test('Updating blog with negative likes is not possible', async() => {
    const blogsInDatabase = await blogsInDb()
    const blog = blogsInDatabase[0]
    blog.likes = -1

    await api
      .put('/api/blogs/' + blog.id)
      .send(blog)
      .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsInDatabase.length)
  })
})

afterAll(() => {
  server.close()
})
