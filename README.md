# INSTRUCTIONS TO FOLLOW

**Table of Contents**

1. [Must Do](#must-do)
2. [Nameing Convensions](#naming-convensions)
   - [Branch Name](#branch-name)
   - [Folder and Files Name](#folder-and-files-name)
   - [Class & Methods name](#class-&-methods-name)
   - [Service Folders](#service-folders)
3. [Error Mapper Identifier Code](#error-mapper-identifier-code)
   - [All Error Codes](ERROR-CODES.md)

## How To Run APP?

```
NODE_ENV=development npm run dev ( You have to pass NODE_ENV to run the app)
```

## Must Do

1.  Document your code with comments
    - **document-this or better-comment** vscode extension might help
2.  Update **swagger yaml** file and push it
3.  Update **Postman** and push it

## Nameing Convensions

We should follow some naming convensions according below:

### Branch Name

    - feat/branch-name (feature branchs)
    - fix/branch-name (fix branchs)
    - update/branch-name (update branchs)

### Folder and Files Name

    - folder name lowercase and ( - ) seperated words (ex: account-service)
    - file name should be camelCase (ex: accountService.ts)

### Class & Methods name

    - Class name should be PascalCase (ex: class AccountService { } )
    - Method name should be camelCase

### Service Folders

```
services
|-- your-service-name
    |-- mapper
        |-- request-mapper.ts
        |-- response-mapper.ts
    | -- interface
        |-- interface.ts
    |-- factory
        |-- index.ts
    -- service.ts
    -- controller.ts
    -- routes.ts
```

> N.B. There also can have multiple files and folders or also can be less files and folder

### Error Mapper Identifier Code

We should follow error mapper custom error code as follow.

- **100** - ( account-service )
- **200** - ( affinity-service )
- **300** - ( bank-auth )
- **400** - ( bank-credential-service )
- **500** - ( bank-login-service )
- **600** - ( bank-onboarding )
- **700** - ( customer-service )
- **800** - ( internal-transfer )
- **900** - ( invitation-service )
- **1000** - ( urban-airship-service )
- **1100** - ( verification )
- **1200** - ( member-service )
- **1300** - ( country-service )
- **1400** - ( transition-service )
- **1500** - ( auth-middleware )
- **1600** - ( savings-goals )
- **1700** - ( atm-service )
- **1800** - ( card-service )
- **2000** - ( jumio-service )
- **2100** - ( p2p-service )
- **4000** - ( Validation Error )
- **5000** - ( Internal Server Error )

---

[Back To Top](#instructions-to-follow)
