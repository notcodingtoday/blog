const posthtml = require('posthtml')
const posthtmlextend = require('posthtml-extend')
const marked = require('marked')
const fs = require('fs');
const common = require('./common')
const blog = require('./blog')

function processAbout() {
  let inputFile = common.PAGE_DIR + "about.md"
  let outputFile = common.PAGE_OUTPUT_DIR + "about.html"

  common.readFile(inputFile, (data) => {
    posthtml([
      posthtmlextend({
        encoding: 'utf8',
        root: common.TEMPLATES_DIR
      })
    ])
    .process(
      pageTemplate("About ", marked(data))
    )
    .then((result) => {
      common.writeFile(outputFile, result.html, inputFile)
    })
  })
}


function onAboutChange(callback) {
  common.watch(common.PAGE_DIR + "about.md", callback)
}


function watchAbout() {
  blog.onCSSChange(processAbout)
  blog.onTemplateChange(processAbout)
  onAboutChange(processAbout)
}


function processIndex() {
  let outputFile = common.PAGE_OUTPUT_DIR + "index.html"

  let entryMap = {}
  let entries = ""

  let blogPosts = fs.readdirSync(common.BLOG_DIR)

  blogPosts.forEach((file) => {
    let path = "/blog/" + file.split(".")[0]
    let inputFile = common.BLOG_DIR + file
    console.log(`Found blog post ${inputFile}`)

    let data = fs.readFileSync(inputFile, 'utf8')

    let title = common.extractTitleFromPost(data)
    let date = common.extractDateFromPost(data)

    entryMap[date] = posthtml([
      posthtmlextend({
        encoding: 'utf8',
        root: common.TEMPLATES_DIR
      })
    ])
    .process(blogEntryTemplate(title, date), { sync: true })
    .html
    .replace("$LINK", path)
  })

  Object.keys(entryMap).sort().forEach((key) => {
    entries = entryMap[key] + entries
  })

  let index = posthtml([
    posthtmlextend({
      encoding: 'utf8',
      root: common.TEMPLATES_DIR
    })
  ])
  .process(indexTemplate(entries), { sync: true })
  .html

  posthtml([
    posthtmlextend({
      encoding: 'utf8',
      root: common.TEMPLATES_DIR
    })
  ])
  .process(pageTemplate("", index))
  .then((result) => {
    common.writeFile(outputFile, result.html)
  })
}


function watchIndex() {
  blog.onTemplateChange(processIndex)
  blog.onBlogChange(processIndex)
}


function indexTemplate(entries) {
  return `<extends src="index.html">
    <block name="entries">${entries}</block>
  </extends>`
}


function blogEntryTemplate(title, date) {
  return `<extends src="blog_entry.html">
    <block name="title">${title}</block>
    <block name="date">${date}</block>
  </extends>`
}


function pageTemplate(title, data) {
  return `<extends src="blog.html">
    <block name="title">${title}//notcoding.today</block>
    <block name="content">
      ${data}
    </block>
  </extends>`
}


module.exports = {
  watchIndex: watchIndex,
  watchAbout: watchAbout,
  processIndex: processIndex,
  processAbout: processAbout,
}
