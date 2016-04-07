var slurm = require('./lib/slurm');
var async = require('async');
var csv = require('to-csv');
var fs = require('fs');

var MIN = 630000;
var MAX = 636600;

var jobRange = [];

for (var i = MIN; i <= MAX; i++) {
  jobRange.push(i);
}


var output = [];

async.eachSeries(jobRange, function (jobID, next) {
  var onEach = function (data) {
    data.map(function (d) {
      output.push(data);
    });
    next();
  };
  slurm.sacct(jobID, onEach);
}, function (err) {

  //TODO write to file

  var CSVOUT = csv(output);

  //console.log(CSVOUT);

  fs.writeFile("./output.csv", CSVOUT, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  console.log('DONE', err);
});
