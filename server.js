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
      }
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
          console.log('finished job', p.JobId);

          //var startRep = p.StartTime.replace('T', ' ');
          //console.log('started', startRep);

          //var started = moment(startRep, "YYYY-MM-DD hh:mm:ss");//2016-04-07T14:31:10
          //var now = moment();

          //var ms = now.diff(started);
          //var d = moment.duration(ms);
          //var s = d.format("hh:mm:ss");

          //console.log('duration:', s);
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