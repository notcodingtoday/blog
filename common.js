const fs = require('fs');
const htmlminify = require('html-minifier').minify;
const cssminify = require('clean-css');


function extractTitleFromPost(data) {
  return data.split("\n")[0].replace("<h1>", "").replace("</h1>", "")
}


function extractDateFromPost(data) {
  return data.split("\n")[1].split(">")[1].replace("</div", "")
}


function watch(inputFile, onChangeCallback) {
  console.log(`Watching ${inputFile}`)
  return fs.watch(inputFile, { interval: 500 }, (event, filename) => {
    if (filename && event === 'change') {
      console.log(`Changed: ${inputFile}`)
      onChangeCallback()
    }
  })
}


function readFile(file, callback) {
  return fs.readFile(file, "utf8", (e, data) => {
    if (e) {
      return console.log(e)
    }
    callback(data)
  })
}


function writeFile(outputFile, data, inputFile) {
  if (outputFile.endsWith("html")) {
    data = htmlminify(data, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeEmptyElements: true,
      removeOptionalTags: true,
    })
  } else if (outputFile.endsWith("css")) {
    data = new cssminify({
      level: 2
    }).minify(data).styles
  }
  return fs.writeFile(outputFile, data, (e) => {
    if (e) {
      return console.log(e)
    }

    if (inputFile) {
      console.log(`${inputFile} > ${outputFile}`)
    } else {
      console.log(`Wrote ${outputFile}`)
    }
  })
}


function forEachFile(directory, callback) {
  return fs.readdir(directory, (e, files) => {
    if (e) {
      return console.log(e)
    }
    files.forEach(file => {
      callback(file)
    })
  })
}


module.exports = {
  TEMPLATES_DIR: "src/templates/",
  CSS_DIR: "src/css/",
  CSS_OUTPUT_DIR: "public/css/",
  BLOG_DIR: "src/blog/",
  BLOG_OUTPUT_DIR: "public/blog/",
  PAGE_DIR: "src/page/",
  PAGE_OUTPUT_DIR: "public/",

  watch: watch,
  readFile: readFile,
  writeFile: writeFile,
  forEachFile: forEachFile,
  extractTitleFromPost: extractTitleFromPost,
  extractDateFromPost: extractDateFromPost
}
