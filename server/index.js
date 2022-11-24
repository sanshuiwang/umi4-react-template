const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

const WEEK = 7 * 24 * 60 * 60 * 1000;

function resolveFromRoot(...relativePath) {
  return path.resolve(__dirname, '..', ...relativePath);
}

const staticFilesUrl = resolveFromRoot('dist');
console.log('加载静态资源:: ', staticFilesUrl);
// 通常用于加载静态资源
app.use(express.static(staticFilesUrl, { maxAge: WEEK }));

app.get('/test', async (req, res) => {
  res.send({ message: 'HELLO WORLD!!!' });
});

// 在你应用 JavaScript 文件中包含了一个 script 标签
// 的 index.html 中处理任何一个 route
app.get('*', function (request, response) {
  const routesUrl = resolveFromRoot('dist', 'index.html');
  console.log('处理任何一个 route:: ', routesUrl);
  response.sendFile(routesUrl);
});

app.listen(port);
console.log('server started on port ' + port);
