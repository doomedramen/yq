var moment = require('moment');

function run(command, args, out, err, close) {
  var spawn = require('child_process').spawn;
  var proc = spawn(command, args);
  proc.stdout.on('data', out);
  proc.stderr.on('data', err);
  proc.on('close', close);
}

function sacct(JOBID, cb) {
  var response;
  var out = function (data) {
    response = parseSacct(data.toString())
  };
  var err = function (data) {
    console.log(`stderr:\n${data}`);
  };
  var close = function (code) {
    cb(response);
  };
  run('sacct', ['--format=Submit,Start,Partition,Account,ReqMem,NNodes', '-X', '-j', JOBID], out, err, close);
}

function timeTween(submit, start) {
  var SubmitTime = submit.replace('T', ' ');
  var StartTime = start.replace('T', ' ');

  var format = "YYYY-MM-DD HH:mm:ss";

  var submitted = moment(SubmitTime, format);
  var started = moment(StartTime, format);

  //var diff = started.diff(submitted);
  //var duration = moment.duration(diff);
  //return duration.get('days') + ':' + duration.get("hours") + ":" + duration.get("minutes") + ":" + duration.get("seconds");

  return started.diff(submitted, 'seconds');
}

function parseSacct(str) {
  //Submit               Start     ReqMem  Partition    Account
  //------------------- ------------------- ---------- ---------- ----------
  //  2016-04-03T19:41:35 2016-04-03T19:41:54     8000Mc tgac-medi+       tgac


  //TODO ignore line 1&2

  var splitted = str.split('\n'); //split by new line

  splitted.splice(0, 2); //get rid of the first 2 lines

  splitted = splitted.filter(function (l) {
    return l.length > 0; //remove any lines that have no length
  });

  var ret = [];

  //console.log(splitted);

  splitted.map(function (s) {
    var line = s.split(' ');

    var cleanedList = line.filter(function (l) {
      return l.length > 0;
    });

    if (cleanedList[0] && cleanedList[1] && cleanedList[2] && cleanedList[3] && cleanedList[4] && cleanedList[5]) {
      ret.push({
        Submit: cleanedList[0],
        Start: cleanedList[1],
        Wait: timeTween(cleanedList[0], cleanedList[1]),
        Partition: cleanedList[2],
        Account: cleanedList[3],
        ReqMem: parseMem(cleanedList[4]),
        NNodes: cleanedList[5]
      });
    }

  });

  return ret;
}

function parseMem(str) {

  var out = str;

  var containsM = str.indexOf('M') > -1;
  var containsG = str.indexOf('G') > -1;

  if (containsM) {
    var M = str.split('M');
    out = M[0];
  } else if (containsG) {
    var G = str.split('G');
    out = G[0] * 1024;
  }

  return out;
}

module.exports = {
  sacct: sacct
};