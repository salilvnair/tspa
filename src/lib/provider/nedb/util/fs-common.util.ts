import * as fs from "fs";

export class FsCommonUtil {
  constructor() {}

  writeFileIfNotExist(fileWithPath: string, contents: string) {
    if (!fs.existsSync(fileWithPath)) {
      var options = options || {};
      options.flag = "wx";
      fs.writeFileSync(fileWithPath, contents, options);
    }
  }

  checkAndCreateDestinationPath(fileDestination) {
    const dirPath = fileDestination.split("\\");
    dirPath.forEach((element: any, index: number) => {
      if (!fs.existsSync(dirPath.slice(0, index + 1).join("/"))) {
        fs.mkdirSync(dirPath.slice(0, index + 1).join("/"));
      }
    });
  }

  readFileAsJson(jsonPath) {
    return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  }
}
