function scontrol(cb) {
  //scontrol  show  job - dd

  var response = [];

  var out = function (data) {
    var all = data.toString().split('\n\n');
    //console.log(all);


    all.map(function (a) {
      if (a.length) {
        var obj = {
          JobId: between(a, 'JobId=', ' '),
          UserId: between(a, 'UserId=', ' '),
          Account: between(a, 'Account=', ' '),
          SubmitTime: between(a, 'SubmitTime=', ' '),
          StartTime: between(a, 'StartTime=', ' '),
          EndTime: between(a, 'EndTime=', ' '),
          TimeLimit: between(a, 'TimeLimit=', ' '),
          JobState: between(a, 'JobState=', ' '),
          Partition: between(a, 'Partition=', ' '),
          MinMemoryNode: between(a, 'MinMemoryNode=', ' '),
          Mem: between(a, 'Mem=', '\n'),
          //UserId: between(a, 'UserId=', ' '),
          Command: between(a, 'Command=', ' '),

          STRING: a
        };

        if (obj.JobId && obj.JobId.length > 1) {
          response.push(obj);
        }


      }

    });

    //JobId=631611 JobName=1760_LIB20878_LDI18217_TTAGGC_L002_R1.fastq.gz_1760_LIB20878_LDI18217_TTAGGC_L002_R2.fastq.gz_run.sh
    //UserId=guptay(10788) GroupId=sl(2006)
    //Priority=1 Nice=0 Account=tsl QOS=normal
    //JobState=PENDING Reason=Resources Dependency=(null)
    //Requeue=0 Restarts=0 BatchFlag=1 Reboot=0 ExitCode=0:0
    //DerivedExitCode=0:0
    //RunTime=00:00:00 TimeLimit=12:00:00 TimeMin=N/A
    //SubmitTime=2016-04-04T18:14:31 EligibleTime=2016-04-04T18:14:31
    //StartTime=2016-04-07T14:31:10 EndTime=Unknown
    //PreemptTime=None SuspendTime=None SecsPreSuspend=0
    //Partition=tsl-medium AllocNode:Sid=v0558:27504
    //ReqNodeList=(null) ExcNodeList=(null)
    //NodeList=(null) SchedNodeList=t128n31
    //NumNodes=1-1 NumCPUs=1 CPUs/Task=1 ReqB:S:C:T=0:0:*:*
    //Socks/Node=* NtasksPerN:B:S:C=0:0:*:* CoreSpec=*
    //MinCPUsNode=1 MinMemoryNode=12000M MinTmpDiskNode=0
    //Features=(null) Gres=(null) Reservation=(null)
    //Shared=OK Contiguous=0 Licenses=(null) Network=(null)
    //Command=./1760_LIB20878_LDI18217_TTAGGC_L002_R1.fastq.gz_1760_LIB20878_LDI18217_TTAGGC_L002_R2.fastq.gz_run.sh
    //WorkDir=/usr/users/sl/guptay/trimmomatic/24h1
    //StdErr=/usr/users/sl/guptay/trimmomatic/24h1/slurm.%N.631611.err
    //StdIn=/dev/null
    //StdOut=/usr/users/sl/guptay/trimmomatic/24h1/slurm.%N.631611.out
    //  TODO INCLUDES NEW LINE, even on last


  };
  var err = function (data) {
    console.log(`stderr:\n${data}`);
  };
  var close = function (code) {
    //console.log(`child process exited with code ${code}`);

    cb(response);
  };

  run('scontrol', ['show', 'job', '-dd', '-a'], out, err, close);
}


function between(strToParse, start, end) {
  var str = strToParse.match(start + "(.*?)" + end);

  if (str != null) {
    return str[1];
  }
  else {
    return '';
  }
}

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
  run('sacct', ['--format=Submit,Start,ReqMem,Partition,Account', '-X', '-j', JOBID], out, err, close);
}


function parseSacct(str) {
  //Submit               Start     ReqMem  Partition    Account
  //------------------- ------------------- ---------- ---------- ----------
  //  2016-04-03T19:41:35 2016-04-03T19:41:54     8000Mc tgac-medi+       tgac


  //TODO ignore line 1&2

  var splitted = str.split('\n');

  console.log(splitted[2]);

  var obj = {
    Submit: '',
    Start: '',
    ReqMem: '',
    Partition: '',
    Account: ''
  };

  return obj;

}

module.exports = {
  scontrol: scontrol,
  sacct: sacct
};