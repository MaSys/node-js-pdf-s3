require('dotenv').config()
var AWS = require('aws-sdk');
var fs = require('fs');
var pdf = require('html-pdf');
var s3 = new AWS.S3();

function createPDF () {
  var filename = 'businesscard.html'
  var html = fs.readFileSync('./' + filename, 'utf8');
  var options = { format: 'Letter' };

  pdf.create(html, options).toStream(function(err, stream) {
    if (err) return console.log(err)
    uploadToS3(stream, filename)
  });
}



function uploadToS3 (body, filename) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  var s3 = new AWS.S3();

  var params = {
    Body: body,
    ACL: 'public-read',
    Bucket: process.env.S3_BUCKET,
    Key: filename
  };
  s3.upload(params, function(err, data) {
    console.log(err, data);
  });
}

createPDF()
