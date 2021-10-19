const express = require('express');
const path = require('path')

const app = express();

const port = process.env.PORT || 3000

// app.get('/', (req, res) => {
//   res.render('index')
// });

app.use(express.static(__dirname + '/public'))

app.listen(port, () => {
  console.log('server started on port', port);
});