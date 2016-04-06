var express = require('express');
var app = express();
var moment = require('moment');

var slurm = require('./lib/slurm');
app.listen(3000, function () {
  console.log('starting monitor');

  var firstRun = true;
  var previous = [];

  function reload() {
    slurm.scontrol(function (out) {

      if (firstRun) {
        previous = out;
        firstRun = false;
        console.log(`found ${out.length} existing jobs`);
      } else {
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

            var start = moment(p.StartTime);
            var now = moment();

            var ms = now.diff(start);
            var d = moment.duration(ms);
            var s = d.format("hh:mm:ss");

            console.log('finished job', p.JobId, 'duration:', s, 'HH:mm:ss');
          }
        });

        previous = out;
      }
    });
  }

  setInterval(function () {
    reload();
  }, 1000);

  reload(); //run now too

});