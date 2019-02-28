![npm (scoped)](https://img.shields.io/npm/v/@salilvnair/tspa.svg?style=plastic)
# Typescript Persistent Api Repository (tspa)

    Typescript Persistent API tspa is similar to
    Springboot JPA repository where we can define our custom
    repo with entity class as generic type and all of the
    default available crud functions can be directly used.

#### 1. Create a model class with a decorator `Database`

```javascript
import { Database } from "@salilvnair/tspa";

@Database("employee")
export class Employee {
  firstName: string;
  lastName: string;
  designation: string;
}
```

#### 2. Create a repo for above model class extending `NeDBRepository` and implement the `returnEntityInstance` method like below

```javascript
import { NeDBRepository } from "@salilvnair/tspa";
import { Employee } from "../model/employee.model";

export class EmployeeRepo extends NeDBRepository<Employee> {
  // this method needs to return an instance of the entity class
  returnEntityInstance(): Employee {
    return new Employee();
  }
}
```

#### 3. How to use it in any Typescript class

```javascript
import { EmployeeRepo } from './employee/repo/employee.repo';
import { Employee } from './employee/model/employee.model';

export class EmployeeService  {
  save(){
    let employeeRepo:EmployeeRepo = new EmployeeRepo();
    let employee:Employee = new Employee();
    employee.firstName = "John";
    employee.lastName = "Doe";
    employee.designation = "CEO";
    this.employeeRepo.save(employee);
  }
}
```

> _when the above code executes a folder named tspa-data will be created at the root path._

> _which will have a subfolder named **nedb** which in turn will have two subfolders named **config** and **database**._

> _config folder contains **nedb.config.json** which is generated as default config._

> _database folder is where the real data recides post save with file named as whatever given in the entity Database decorators value._
