import { UserRepo } from "./repo/user.repo";
import { User } from "./model/user.model";

let userRepo:UserRepo = new UserRepo();
let user:User = new User();
user.firstName ="Johny";
user.lastName="Sins";
userRepo.save(user);