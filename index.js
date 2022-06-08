require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
//Set Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const { Schema } = mongoose;


const urlSchema = new Schema({
  original_url : { type: String, required: true },
  short_url  : { type: String, required: true },
});

let Url = mongoose.model('Url', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

function generateString(numOfLen){
  let str = "";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  for(let i=0;i<numOfLen;i++){
    let randAscii = Math.floor(Math.random() * 52);
    str += alphabet[randAscii];
  }
  return str;
}

//route section
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:short_url', async function(req, res) {
  var short_url = req.params.short_url;
      
      console.log(short_url)
      var findUrl = await   Url.findOne({short_url:short_url})
      console.log(findUrl)
      if(findUrl === null) {
        res.json({
          error: 'invalid url'
        })
      }else{
        await res.redirect(findUrl.original_url)
      };
});

app.post('/api/shorturl', async function(req, res) {
    let originUrl = origin_url = req.body.url;
    originUrl = originUrl.toLowerCase();

    //validate url section
    let validateUrl;
    try{
      validateUrl = new URL(originUrl);
      if(validateUrl.protocol != "https:" && validateUrl.protocol !="http:"){
        //catch
      }
      validateUrl = validateUrl.hostname + validateUrl.pathname;
      console.log(originUrl);
      dns.lookup(originUrl, function(err, address) {
          if(err){
            //catch
          }
      });
    }catch(e){
      res.json({
        error: 'invalid url'
      })
    }

    while(true){
      var short_url = generateString(5);
      
      console.log(short_url)
      var findUrl = await   Url.find({short_url:short_url})
      if(JSON.stringify(findUrl) === "[]") {
        console.log(findUrl)
        break;
      }else{
        console.log("INI",findUrl)
      };
    }

    console.log("HERE",short_url,origin_url)
    let url = new Url();
    url.original_url = origin_url;
    url.short_url = short_url;
    var trySave = await url.save()

    res.json(trySave);
    
  

  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
