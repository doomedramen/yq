var slurm = require('./lib/slurm');

var MIN = 630000;
var MAX = 636600;

var jobRange = [];

for (var i = MIN; i <= MAX; i++) {
  jobRange.push(i);
}


var output = [];

jobRange.map(function (i) {

  var onEach = function (data) {

    //output.push(data);

    console.log(data);

  };

  slurm.sacct(i, onEach);
});