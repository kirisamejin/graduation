import * as fs from "fs";
import * as readline from "readline";

export const readFile = (
  path: string,
  callback: (res: Array<Array<number>>) => void
) => {
  const f = fs.createReadStream(path);
  const o = readline.createInterface({
    input: f
  });
  const result = new Array();
  let tmp: Array<number> | null = null;
  let cnt = 0;
  let tmp_cnt = 0;
  o.on("line", line => {
    if (cnt == 0) {
      cnt = parseInt(line);
    } else if (tmp_cnt == 0) {
      tmp = new Array();
      tmp_cnt = parseInt(line);
    } else {
      const [longitude, latitude] = line.split(",");
      if (tmp) {
        tmp = tmp.concat([parseFloat(longitude), parseFloat(latitude)]);
      }
      tmp_cnt--;
      if (tmp_cnt == 0) {
        result.push(tmp);
      }
    }
  });

  o.on("close", () => {
    callback(result);
  });
};
