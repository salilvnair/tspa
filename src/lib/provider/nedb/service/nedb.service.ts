import * as NgpaConstant from "../../../constant/ngpa.constant";
import * as NeDBConstant from "../constant/nedb.constant";
import { ID_PROPERTY_DECORATOR_KEY } from "../decorator/identifier.metadata";
import * as path from "path";
import * as fs from "fs";
export class NeDBService<T> {
  constructor() {}
  selectAllSync(databaseName: string): T[] {
    var rows: T[] = [];    
    var configPathDetail = path.join(
      process.cwd(),
      NgpaConstant.TSPA_FOLDER_NAME,
      NeDBConstant.NEDB_HOME_FOLDER_NAME,
      NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
      databaseName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
    );

    var data = fs.readFileSync(configPathDetail, "utf8");
    if (data == "" || data == null) {
      return rows;
    }
    var arr: string[] = data.trim().split(/\r|\n/);
    arr.forEach(el => {
      var eld = JSON.parse(el);
      rows.push(eld);
    });
    return rows;
  }

  selectOneSync(id: string, databaseName: string): T {
    var row: T = Object.assign(null);
    var rows: T[] = this.selectAllSync(databaseName);
    if (rows.length > 0) {
      rows.find(function(rowItr, index) {
        return rowItr["_id"] === id;
      });
    }
    return row;
  }
  selectOneByColumnSync(columnName: string, columnValue: string, databaseName: string): T {
    var row: T = <T>{};
    var rows: T[] = this.selectAllSync(databaseName);
    if (rows.length > 0) {
      var index = rows.findIndex(rowItr => rowItr[columnName] === columnValue);
      if (index > -1) {
        row = rows[index];
      }
    }
    return row;
  }
  generateUniqueId(entity: T) {
    const metadata = Reflect.getMetadata(ID_PROPERTY_DECORATOR_KEY, entity.constructor);
  }
}
