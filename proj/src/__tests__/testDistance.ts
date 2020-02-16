import * as fs from "fs";
import * as readline from "readline";
import * as Cesium from "cesium";


const path = "src/data/sampledata/testData.txt";
const readFile = (path: string, callback: (res: Array<Array<any>>) => void) => {
   const f = fs.createReadStream(path);
   const o = readline.createInterface({
       input: f
   });
   const result = new Array();
   let tmp: Array<any> | null = null;
   let cnt = 0;
   let tmp_cnt = 0;
   o.on("line", (line) => {
       if (cnt == 0) {
           cnt = parseInt(line);
       } else if(tmp_cnt == 0) {
           tmp = new Array();
           tmp_cnt = parseInt(line);
       } else {
           const [longitude, latitude] = line.split(',');
           if (tmp) {
               tmp = tmp.concat([longitude, latitude]);
           }
           tmp_cnt--;
           if (tmp_cnt == 0) {
               result.push(tmp);
           }
       }
   })

   o.on('close', () => {
       callback(result);
   })
}

describe('Calculator Tests', function() {

  const calc = (log: number, lat: number, data, callback) => {

    let distance;
    console.log(log, lat);
    for (let positions of data) {
      positions = positions.map((pos) => parseFloat(pos));
      distance = 2147483647;
      for (let i = 0; i < positions.length; i += 2) {
        const longitude = positions[i];
        const latitude = positions[i + 1];
        console.log(longitude, latitude);
        let tmp = Cesium.Cartesian3.distance(
          Cesium.Cartesian3.fromDegrees(longitude, latitude),
          Cesium.Cartesian3.fromDegrees(log, lat)
        );
        distance = Math.min(
          tmp,
          distance
        );
        console.log(distance, tmp);
      }
    }
    callback();
  }
  it('returns 1 + 1 = 2', function(done) {

      // readFile(path, (data) => calc(117.19159126, 31.84978405, data, done));
      readFile(path, (data) => calc(117.17133522, 31.85459582, data, done));
  });

});
