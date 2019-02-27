import { NeDBConfig } from "../model/nedb-config.model";
import * as NeDBConstant from "../constant/nedb.constant";
import * as NgpaConstant from "../../../constant/ngpa.constant";
import { FsCommonUtil } from "../util/fs-common.util";
import * as path from "path";
import * as nedb from "nedb";

export class NeDBConnectionManager {
  private fsCommonUtil: FsCommonUtil = new FsCommonUtil();
  constructor() {}
  getInstance() {
    return this.getDefinedInstance(
      NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME,
      NeDBConstant.NEDB_CONFIG_DEFAULT_DB_FILE_NAME
    );
  }

  getDefinedInstance(databaseFolderName: string, databaseFileName: string) {

    var pathDetail = path.join(
      process.cwd(),
      NgpaConstant.TSPA_FOLDER_NAME,
      NeDBConstant.NEDB_HOME_FOLDER_NAME,
      databaseFolderName,
      databaseFileName + NeDBConstant.NEDB_DATABASE_FILENAME_EXTENSTION
    );
    var Datastore = nedb;
    var dbSourceInstance = new Datastore({
      filename: pathDetail,
      autoload: true
    });
    return dbSourceInstance;
  }

  getInMemoryInstance() {
    var Datastore = nedb;
    var dbSourceInstance = new Datastore();
    return dbSourceInstance;
  }

  public getNeDBConfig(): NeDBConfig {
    var configPathDetail = path.join(
      process.cwd(),
      NgpaConstant.TSPA_FOLDER_NAME,
      NeDBConstant.NEDB_HOME_FOLDER_NAME,
      NgpaConstant.TSPA_SUBFOLDER_CONFIG,
      NgpaConstant.TSPA_PROVIDER_CONFIG_NEDB
    );
    var basePath = path.join(
      process.cwd(),
      NgpaConstant.TSPA_FOLDER_NAME,
      NeDBConstant.NEDB_HOME_FOLDER_NAME,
      NgpaConstant.TSPA_SUBFOLDER_CONFIG
    );
    this.fsCommonUtil.checkAndCreateDestinationPath(basePath);
    var nedbBasicConfig = {
      applicationName: "your_app",
      createExplicitDB: true,
      inMemoryDB: false
    };
    var nedbBasicConfigString = JSON.stringify(nedbBasicConfig);
    this.fsCommonUtil.writeFileIfNotExist(configPathDetail, nedbBasicConfigString);
    return this.fsCommonUtil.readFileAsJson(configPathDetail);
  }
}
