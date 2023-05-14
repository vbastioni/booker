# Challenge

## TODO:
### Technical requirements
- [x] The code must be written in TypeScript on NodeJS
- [x] The database should be a relational database like Postgres or SQLlite.
- [ ] The API should be RESTFul.
- [ ] Tests. Quality is more important than having a lot of features ;)

### Features
The needed features should be:
- [x] A REST API allowing to list, create, edit, delete appointments with the described details above.
- [x] A endpoint allowing to find all appointments for a specific day
- [x] Be certain that there is no conflicting appointment for the host or client
- [x] (optional) an endpoint allowing to search buyers by name or company name in an efficient way

### Tests
#### Appointments:
- Controller:
  - [x] Create
  - [x] Read
  - [ ] Update
  - [x] Delete
  - [x] All
  - [x] All for a specific day
- Service:
  - [x] Create
  - [x] Read
  - [ ] Update
  - [x] Delete
  - [x] All
  - [x] All for a specific day
  - [ ] No scheduling conflicts

#### Other
- [ ] Search buyers by name
- [ ] Search buyers by company
