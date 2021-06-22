const posthtml = require('posthtml')
const posthtmlextend = require('posthtml-extend')
const marked = require('marked')
const hljs = require('highlight.js')
const common = require('./common')


function processBlog() {
  common.forEachFile(common.BLOG_DIR, (file) => {
    let inputFile = common.BLOG_DIR + file
    let outputFile = common.BLOG_OUTPUT_DIR + file.replace(".md", ".html")
    common.readFile(inputFile, (data) => {
      posthtml([
        posthtmlextend({
          encoding: 'utf8',
          root: common.TEMPLATES_DIR
        })
      ])
        .process(blogTemplate(marked(data, {
          highlight: (code, language) => {
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
            return hljs.highlight(code, { language: validLanguage, ignoreIllegals: true }).value;
          },
        })))
        .catch((err) => {
          console.log(err)
        })
        .then((result) => {
          common.writeFile(outputFile, result.html, inputFile)
        })
    })
  })
}


function processCSS() {
  common.forEachFile(common.CSS_DIR, (file) => {
    let inputFile = common.CSS_DIR + file
    let outputFile = common.CSS_OUTPUT_DIR + file
    common.readFile(inputFile, (data) => {
      common.writeFile(outputFile, data, inputFile)
    })
  })
}


function onBlogChange(callback) {
  common.forEachFile(common.BLOG_DIR, (file) => {
    let inputFile = common.BLOG_DIR + file
    common.watch(inputFile, callback)
  })
}


function onTemplateChange(callback) {
  common.forEachFile(common.TEMPLATES_DIR, (file) => {
    let inputFile = common.TEMPLATES_DIR + file
    common.watch(inputFile, callback)
  })
}


function onCSSChange(callback) {
  common.forEachFile(common.CSS_DIR, (file) => {
    let inputFile = common.CSS_DIR + file
    common.watch(inputFile, () => {
      processCSS()
      callback()
    })
  })
}


function watchBlog() {
  onBlogChange(processBlog)
  onTemplateChange(processBlog)
  onCSSChange(processBlog)
}


function blogTemplate(data) {
  let title = common.extractTitleFromPost(data)
  return `<extends src="blog.html">
    <block name="title">${title} //notcoding.today</block>
    <block name="content">${data}</block>
  </extends>`
}


module.exports = {
  processBlog: processBlog,
  processCSS: processCSS,
  onCSSChange: onCSSChange,
  onTemplateChange: onTemplateChange,
  onBlogChange: onBlogChange,
  watchBlog: watchBlog
}
