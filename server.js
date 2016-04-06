var express = require('express');
var app = express();

var slurm = require('./lib/slurm');
app.listen(3000, function () {
  console.log('starting monitor');

  var previous = [];

  function reload() {
    slurm.scontrol(function (out) {


      out.map(function (o) {
        var match = previous.filter(function (p) {
          return p.JobId == o.JobId;
        });

        if (match.length < 1) {
          console.log('new job', o.JobId);
        }
      });

      previous.map(function (p) {
        var match = out.filter(function (o) {
          return p.JobId == o.JobId;
        });

        if (match.length < 1) {
          console.log('finished jon', p.JobId);
        }
      });

      previous = out;
    });
  }

  setInterval(function () {
    reload();
  }, 1000);

  reload(); //run now too

});