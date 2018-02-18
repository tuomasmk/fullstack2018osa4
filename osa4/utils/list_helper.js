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

module.exports = {
  totalLikes,
  favoriteBlog
}