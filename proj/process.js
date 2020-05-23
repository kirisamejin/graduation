var fs = require('fs');

function getCredits(child) {
  console.log("type:", child["type"]["nameZh"]);

  planCourses = child["planCourses"];

  console.log("number:", planCourses.length);
  var totalCredit = 0;
  for (var course of planCourses) {
    var c = course["course"];
    var credit = c["credits"];
    totalCredit += Number(credit);
  }
  console.log("total:", totalCredit);
  return totalCredit;
}

fs.readFile('./course.json', (err, data) => {
  if (err) {
    return console.error(err);
  }

  var courses = JSON.parse(data.toString());
  var tot = 0;
  for (var child of courses["children"]) {
    tot += getCredits(child);
  }
  console.log(tot);
});