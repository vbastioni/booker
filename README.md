# Challenge

## TODO:
### Technical requirements
- The code must be written in TypeScript on NodeJS
- The database should be a relational database like Postgres or SQLlite.
- The API should be RESTFul.
- Tests. Quality is more important than having a lot of features ;)

### Features
The needed features should be:
- A REST API allowing to list, create, edit, delete appointments with the described details above.
- A endpoint allowing to find all appointments for a specific day
- Be certain that there is no conflicting appointment for the host or client
- (optional) an endpoint allowing to search buyers by name or company name in an efficient way

### Tests
#### Appointments:
- Controller:
  - [x] Create
  - [x] Read
  - [x] Update
  - [x] Delete
  - [x] All
  - [x] All for a specific day
- Service:
  - [x] Create
  - [x] Read
  - [x] Update
  - [x] Delete
  - [x] All
  - [x] All for a specific day
  - [x] No scheduling conflicts (no overlap function checked)

#### Other
- Controller
  - [x] Search buyers by name
  - [x] Search buyers by company
- Service
  - [x] Search buyers by name
  - [x] Search buyers by company
