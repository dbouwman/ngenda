var fs = require("fs"),
  moment = require("moment");


// sessions.json is the response from 
// http://cdh.esri.com/2.0/?action=getWebAppData&confid=65
// it's ~3.5MB
// after removing unused info, it's ~1MB, probably ~200K gzipped
var source = "curl-sessions.json";
var out = "app/scripts/data/sessions.js";

fs.exists(out, function(exists) {
  if ( exists ) {
    fs.unlink(out, function(err) {
      go();
    });
  } else {
    go();
  }
});

function go() {
  fs.readFile(source, "utf-8", function(err, data) {
    sessions(data);
  });
}

function sessions(data) {
  // 7/5/2014:  there were a few backslashes in weird places that were
  // causing errors when passing data with JSON.parse().
  // Examples:  www.fema.gov\hazus, GIS Analyst\Environmental Scientist
  // Replace backslashes that aren't followed by " (double-quotes).
  data = data.replace(/\\([^"])/g, function(m, g) { return "/" + g; });
  // Strip vertical tabs, they also break stuff.
  data = data.replace(/\v/g, "");
  var s = JSON.parse(data);
  var results = s.sessionsView.results;
  var relevant = {};
  // relevant.conference = s.conference;
  relevant.conference = {
    results: [{
      fullname: s.conference.results[0].fullname,
      year: s.conference.results[0].year
    }]
  };
  relevant.sessionsView = {};
  relevant.sessionsView.count = s.sessionsView.count;
  relevant.sessionsView.results = results.map(function(session) {
    var sd = moment(session.startDate);
    var ed = moment(session.endDate);
    var duration = moment.duration( ed.subtract(sd) ,'minutes').humanize();
    return {
      dy: sd.format('dddd'),
      sd: sd.format('h:mm a'),
      dur: duration,
      t: session.sessionTitle,
      eid: session.eventTypeID,
      d: session.sessionDescription,
      c: session.contacts,
      r: session.room,
      sid: session.sessionID,
      oid: session.offeringID
    }
  });
  fs.writeFile(out, 'var ucdata = ' + JSON.stringify(relevant), function(err) {
    if ( err ) {
      throw err;
    }
    console.log("Wrote file", out);
  });
}