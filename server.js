var express = require('express');
var app = express();
var moment = require('moment');

var slurm = require('./lib/slurm');
app.listen(3000, function () {
  console.log('starting monitor');

  var firstRun = true;
  var previous = [];


  var completed = [];

  function reload() {
    slurm.scontrol(function (out) {

      out.map(function (o) {

        if (o.JobState == 'COMPLETED') {
          if (completed.filter(function (c) {
              return c.JobId == o.JobId;
            }).length < 1) {
            console.log(o);
            completed.push(o);
          }
        }
      });


      //if (firstRun) {
      //  previous = out;
      //  firstRun = false;
      //  console.log(`found ${out.length} existing jobs`);
      //}
      //out.map(function (o) {
      //  var match = previous.filter(function (p) {
      //    return p.JobId == o.JobId;
      //  });
      //  if (match.length < 1) {
      //    console.log('new job', o.JobId);
      //  }
      //});
      //previous.map(function (p) {
      //  var match = out.filter(function (o) {
      //    return p.JobId == o.JobId;
      //  });
      //  if (match.length < 1) {
      //    console.log('finished job', p.JobId);
      //  }
      //});
      //previous = out;
    });
  }

  setInterval(function () {
    reload();
  }, 1000);
  reload(); //run now too

});