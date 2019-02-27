import { Database } from "../../lib/provider/nedb/decorator/database.metadata";

@Database("user")
export class User {
    firstName:string;
    lastName:string;
}