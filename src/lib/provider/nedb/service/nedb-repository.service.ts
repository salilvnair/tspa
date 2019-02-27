import { INgpaWriteRespository } from "../../../service/ngpa-respository.service";
import { INgpaReadRespository } from "../../../service/ngpa-repository.service";
import { JsonCommonUtil } from "../util/json-common.util";
import { NeDBConnectionManager } from "./nedb-manager.service";
import { NeDBConfig } from "../model/nedb-config.model";
import * as NeDBConstant from "../constant/nedb.constant";
import { NeDBService } from "./nedb.service";
export abstract class NeDBRepository<T>
  implements INgpaWriteRespository<T>, INgpaReadRespository<T> {
  private initializedNeDB: boolean = false;
  private initializedNeDBConfig: boolean = false;
  private neDBConnectionManager: NeDBConnectionManager = new NeDBConnectionManager();
  private neDBService: NeDBService<T> = new NeDBService<T>();
  constructor(    
  ) {
    this.init();
  }
  private neDB: any;
  private neDBConfig: NeDBConfig;
  abstract returnEntityInstance(): T;
  private init() {
    if (!this.initializedNeDBConfig) {
      this.initNeDBConfig();
      this.initializedNeDBConfig = true;
    }
    if (!this.initializedNeDB) {
      this.initNeDb();
      this.initializedNeDB = true;
    }
  }
  private initNeDb() {
    if (this.neDBConfig.inMemoryDB) {
      this.neDB = this.neDBConnectionManager.getInMemoryInstance();
    } else {
      if (this.neDBConfig.createExplicitDB) {
        this.initExplicitDB();
      } else {
        this.initAppDefinedDB();
      }
    }
  }

  public setPersistance(inMemory: boolean) {
    if (inMemory) {
      this.neDB = this.neDBConnectionManager.getInMemoryInstance();
    } else {
      this.initExplicitDB();
    }
  }

  private initExplicitDB() {
    this.neDB = this.neDBConnectionManager.getDefinedInstance(
      this.getDatabaseFolderName(),
      this.getDatabaseNameFromRepo()
    );
  }

  private initAppDefinedDB() {
    this.neDB = this.neDBConnectionManager.getInstance();
  }

  private getDatabaseNameFromRepo() {
    let value: string = Reflect.getMetadata("Database", this.returnEntityInstance().constructor);
    if (value) {
      return value.toLocaleLowerCase();
    }
    return value;
  }

  private getDatabaseFolderName() {
    return NeDBConstant.NEDB_CONFIG_DATABASE_FOLDER_NAME;
  }

  private initNeDBConfig() {
    this.neDBConfig = this.neDBConnectionManager.getNeDBConfig();
  }

  compactDatabase() {
    this.neDB.persistence.compactDatafile();
  }

  find(entity: T): Promise<T[]> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.find(entity, { multi: true }, function(err, entityDatas) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityDatas);
      });
    });
  }
  selectAll(): Promise<T[]> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.find({}, function(err, entityDatas) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityDatas);
      });
    });
  }
  selectAllSync(): T[] {
    return this.neDBService.selectAllSync(this.getDatabaseNameFromRepo());
  }
  selectOneSync(id: string): T {
    return this.neDBService.selectOneSync(id, this.getDatabaseNameFromRepo());
  }
  selectOneByColumnSync(coloumnName: string, coloumnValue: string): T {
    return this.neDBService.selectOneByColumnSync(
      coloumnName,
      coloumnValue,
      this.getDatabaseNameFromRepo()
    );
  }

  findOne(id: string): Promise<T> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.find({ _id: id }, function(err, entityData) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityData);
      });
    });
  }
  update(oldEntity: T, newEntity: T): Promise<T> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.update(oldEntity, newEntity, {}, function(err, entityData) {
        if (err !== null) {
          console.dir(err);
          return reject(err);
        }
        resolve(entityData);
      });
    });
  }
  save(entity: T): Promise<T> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.insert(entity, function(err, entityData) {
        if (err !== null) {
          return reject(err);
        }
        resolve(entityData);
      });
    });
  }

  delete(entity: T, removeNullValues?: boolean, removeEmptyValues?: boolean): Promise<number> {
    var self = this;
    if (removeNullValues) {
      JsonCommonUtil.removeNullValues(entity);
    } else if (removeEmptyValues) {
      JsonCommonUtil.removeEmptyValues(entity);
    }
    if (removeEmptyValues && removeNullValues) {
      JsonCommonUtil.removeNEValues(entity);
    }
    return new Promise(function(resolve, reject) {
      self.neDB.remove(entity, { multi: true }, function(err, deleteCount) {
        if (err !== null) return reject(err);
        resolve(deleteCount);
      });
    });
  }
  deleteById(id: string): Promise<number> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.remove({ _id: id }, function(err, deleteCount) {
        if (err !== null) return reject(err);
        resolve(deleteCount);
      });
    });
  }
  deleteAll(): Promise<number> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.neDB.remove({}, { multi: true }, function(err, deleteCount) {
        if (err !== null) return reject(err);
        resolve(deleteCount);
      });
    });
  }
}
