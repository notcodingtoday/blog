const blog = require('./blog')
const page = require('./page')

function Watch() {
  blog.watchBlog()
  page.watchIndex()
  page.watchAbout()
}

function Process() {
  blog.processBlog()
  blog.processCSS()
  page.processIndex()
  page.processAbout()
}

if (process.argv.length > 2) {
  for (i = 0; i < process.argv.length; i++) {
    if (process.argv[i] == "watch") {
      Watch()
    } else {
      Process()
    }
  }
} else {
  Process()
}

