const blog = require('./blog')
const page = require('./page')

if (process.argv[2] == "watch") {
  blog.watchBlog()
  page.watchIndex()
  page.watchAbout()
} else {
  blog.processBlog()
  blog.processCSS()
  page.processIndex()
  page.processAbout()
}
