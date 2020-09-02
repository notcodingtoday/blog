const blog = require('./blog')
const page = require('./page')

if (process.argv[2] == "watch") {
	blog.watchBlog()
	page.watchIndex()
	page.watchAbout()
} else {
	blog.processBlog()
	page.processIndex()
	page.processAbout()
}
