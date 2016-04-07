var slurm = require('./lib/slurm');
var async = require('async');
var fs = require('fs');
var json2csv = require('json2csv');

var MIN = 320000;
var MAX = 631600;

var jobRange = [];

for (var i = MIN; i <= MAX; i++) {
  jobRange.push(i);
}


var output = [];

async.eachSeries(jobRange, function (jobID, next) {
  var onEach = function (data) {
    data.map(function (d) {
      output.push(d);
    });
    next();
  };
  slurm.sacct(jobID, onEach);
}, function (err) {

  var fields = ['Submit', 'Start', 'Wait', 'Partition', 'Account', 'ReqMem', 'NNodes'];


  json2csv({data: output, fields: fields, quotes: ''}, function (err, csv) {
    if (err) {
      console.error(err);
    } else {
      fs.writeFile("./output.csv", csv, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
    }
  });
});
