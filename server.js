var express = require('express');
var app = express();
var moment = require('moment');
var fs = require('fs');

var log = './LOG.txt';

var slurm = require('./lib/slurm');
app.listen(3000, function () {
  console.log('starting monitor\n\n');

  //var firstRun = true;
  //var previous = [];


  var completed = [];

  function reload() {
    slurm.scontrol(function (out) {

      out.map(function (o) {

        if (o.JobState == 'COMPLETED') {
          if (completed.filter(function (c) {
              return c.JobId == o.JobId;
            }).length < 1) {
            completed.push(o);

            fs.appendFile(log, o.STRING + '\n\n', function (err) {

            });

            //SubmitTime: '2016-04-06T15:13:52',
            //StartTime: '2016-04-06T15:14:16',


            var SubmitTime = o.SubmitTime.replace('T', ' ');
            var StartTime = o.StartTime.replace('T', ' ');

            var format = "YYYY-MM-DD HH:mm:ss";

            var submitted = moment(SubmitTime, format);
            var started = moment(StartTime, format);

            var diff = started.diff(submitted);
            var duration = moment.duration(diff);
            //var human = duration.humanize();

            var exact = duration.get('days') + ' days ' + duration.get("hours") + " hours " + duration.get("minutes") + " minutes " + duration.get("seconds") + ' seconds';
            console.log('Job:', o.JobId, 'Account:', o.Account, 'Partition:', o.Partition, 'Memory:', o.Mem || o.MinMemoryNode, 'Waited:', exact, 'before it started');

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