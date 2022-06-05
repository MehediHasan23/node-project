const http = require('http');
const fs = require('fs');
const formidable = require('formidable');


const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method.toLowerCase();

  if (url === '/' && method === 'get') {
    res.writeHead(200, 'successful', {
      "content-type": "text/html"
    })
    const form = fs.readFileSync('./index.html');
    res.write(form);
    res.end()
  } else if (url === '/process' && method === 'post') {
    const formData = new formidable.IncomingForm()
    formData.parse(req, (err, fields, files) => {
      if (err) {
        res.end(`sob shes`)
      } else {

        const fname = fields.fname;
        const path = files.pic.filepath;
        files.pic.originalFilename = `profile.png`
        const profile = files.pic.originalFilename;
        const data = JSON.stringify(fields);

        fs.mkdir(`./data/${fname.toLowerCase()}`, (err) => {
          if (!err) {
            try {
              fs.writeFileSync(`${__dirname}/data/${fname.toLowerCase()}/${fields.email}.json`, data)
              fs.renameSync(path, `${__dirname}/data/${fname.toLowerCase()}/${profile}`)
              console.log(`data save successfully`);
            } catch {
              console.log(err);
            }
          } else {
            console.log(err);
          }
        })

      }
    })

    res.end(`Thanks for submitting ....`)
  }

})


const port = 3000;
server.listen(port, `localhost`, () => {
  console.log(`server is running on port: ${port}`);
})