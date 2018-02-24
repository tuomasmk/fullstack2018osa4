const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    let favorite = blogs[0]
    blogs.forEach(blog => {
      if (blog.likes > favorite.likes)
        favorite = blog
    })
    return favorite
  }
  return {}
}

const mostBlogs = (blogs) => {
  let blogsPerAuthor
  if (blogs.length > 0) {
    blogsPerAuthor = blogs.map(blog => blog.author).reduce((a,b) => a.set(b,a.get(b)+1||1),new Map)
  }
  console.log(blogsPerAuthor)
  let author = blogsPerAuthor.keys()[0]
  let numberOfBlogs = 0
  for (let key of blogsPerAuthor.keys()) {
    if (blogsPerAuthor.get(key) > numberOfBlogs) {
      numberOfBlogs = blogsPerAuthor.get(key)
      author = key
    }
  }
  return {
    author: author,
    blogs: numberOfBlogs
  }
}

const mostLikes = (blogs) => {
  const likesPerAuthor = new Map()
  if (blogs.length > 0) {
    for (let index = 0; index < blogs.length; index++) {
      let a = blogs[index].author
      let l = blogs[index].likes
      likesPerAuthor.set(blogs[index].author, (likesPerAuthor.has(a) ? likesPerAuthor.get(a) : 0 ) + l )
    }
    let author
    let likes
    for (let [key, value] of likesPerAuthor) {
      if (likes === undefined || value > likes) {
        likes = value
        author = key
      }
    }
    return {
      author: author,
      likes: likes
    }
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}