var slurm = require('./lib/slurm');
var async = require('async');

var MIN = 630000;
var MAX = 636600;

var jobRange = [];

for (var i = MIN; i <= MAX; i++) {
  jobRange.push(i);
}


var output = [];

//jobRange.map(function (i) {
//  var onEach = function (data) {
//    console.log(data);
//  };
//  slurm.sacct(i, onEach);
//});

async.eachSeries(jobRange, function (jobID, next) {
  var onEach = function (data) {
    console.log(data);
    next();
  };
  slurm.sacct(jobID, onEach);
}, function (err) {
  console.log('DONE', err);
});


//var onEach = function (data) {
//  console.log(data);
//};
//slurm.sacct(636600, onEach);
