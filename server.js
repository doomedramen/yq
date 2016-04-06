var express = require('express');
var app = express();

var slurm = require('./lib/slurm');
app.listen(3000, function () {
  console.log('starting monitor');

  var previous = [];

  setInterval(function () {
    slurm.scontrol(function (out) {


      out.map(function (o) {
        if (previous.indexOf(o) < 0) {
          console.log('new job', o.JobId);
        }
      });

      previous.map(function (p) {
        if (out.indexOf(p) < 0) {
          console.log('finished job', p.JobId);
        }
      });
      //out.map(function (a) {
      //  if (previous.filter(function (p) {
      //      return p.JobId == a.JobId;
      //    }).length < 1) {
      //    console.log('new job', a.JobId);
      //  }
      //});

      //previous.map(function (p) {
      //  if (out.filter(function (o) {
      //      return o.JobId == p.JobId;
      //    }).length < 1) {
      //    console.log('finished job', p.JobId);
      //  }
      //});

      previous = out;
    });

  }, 10000)


});