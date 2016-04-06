var express = require('express');
var app = express();

var slurm = require('./lib/slurm');
app.listen(3000, function () {
  console.log('starting monitor');


  //setInterval(function () {
  slurm.scontrol();
  //}, 1000)


});