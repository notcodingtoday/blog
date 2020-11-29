# notcoding.today Blog

Visit [notcoding.today](https://notcoding.today) to see the result.

Entire workflow is done with built-in `fs` package and `posthtml` elements.

## Quick start

Create output directories

```bash
mkdir -p public/blog
mkdir -p public/css
mkdir -p public/images
```

Process and host the blog locally

```bash
npm start process
npm run host
```

Watch the `src` files and regenerate blog

```bash
npm start watch
```

## Dependencies

Outside dependencies listed in `package.json`, this expects that you have [http-server](https://www.npmjs.com/package/http-server) installed globally.
