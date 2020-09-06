const marked = require('marked');
const fs = require('fs');


fs.readFile("src/blog/godot-interactive-grass.md", "utf8", (e, data) => {
  if (e) {
    return console.log(e)
  }
  var a = marked(data).trim();
  console.log(a)
})