# Database Helper Endpoints
---
## Users
### /api/getUser/:id
**Type:** GET
**Description:** Gets a user profile.
**Parameters:**
```json
id : User Google ID. Should be collected from session token.
```
**Response (Success):**
```json
{
    "techs": [String],
    "bio": String,
    "projects": [ProjectSchema],
    "_id": ObjectID,
    "id": String,
    "userName": String,
    "__v": Number
}
```
**Response (Fail, 404):**
```json
{
    "resp": "User :id not found"
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```

### /api/deleteUser/:id
**Type:** DELETE
**Description:** Deletes a user profile.
**Parameters:**
```json
id : User Google ID. Should be collected from session token.
```
**Response (Success):**
```json
{
    "resp" : {
        "techs": [String],
        "bio": String,
        "projects": [ProjectSchema],
        "_id": ObjectID,
        "id": String,
        "userName": String,
        "__v": Number
    }
}
```
**Response (Fail, 404):**
```json
{
    "resp": "User :id not found"
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```

### /api/addUser
**Type:** POST
**Description:** Creates a user profile.
**Body:**
```json
 {
  "id" : String,        //REQUIRED, Google ID returned from oauth
  "userName" : String,  //REQUIRED, Created username
  "techs" : [String],     //Technologies chosen to display on profile
  "bio" : String          //User bio
 }
```
**Response (Success):**
```json
{
    "resp": {
        "techs": [String],
        "bio": String,
        "projects": [ProjectSchema],
        "_id": ObjectID,
        "id": String,
        "userName": String,
        "__v": Number
    }
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```
### /api/updateUser/:id
**Type:** POST
**Description:** Updates a user profile.
**Body:**
```json
{
    [Whatever user fields you wish to update with their new value]
}
```
**Response (Success):**
```json
{
    "resp": { //This will be the document before the change.
        "techs": [String],
        "bio": String,
        "projects": [ProjectSchema],
        "_id": ObjectID,
        "id": String,
        "userName": String,
        "__v": Number
    }
}
```
**Response (Fail, 404):**
```json
{
    "resp": "User :id not found"
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```
---
## Projects
### /api/getProject/:id
**Type:** GET
**Description:** Gets a project's details.
**Parameters:**
```json
id : The document ID for the project.
```
**Response (Success):**
```json
{
    "score": Number,                
    "contributors": [String],       // Google IDs of non-owner contributors
    "description": String,
    "comments": [commentSchema],
    "_id": String,                  // Document ID
    "title": String,
    "owner": String,                // Google ID of owner
    "__v": Number
}
```
**Response (Fail, 404):**
```json
{
    "resp": "Project :id not found"
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```

### /api/deleteProject/:id
**Type:** DELETE
**Description:** Deletes a Project.
**Parameters:**
```json
id : The document ID for the project.
```
**Response (Success):**
```json
{
    "resp" : {
        "score": Number,                
        "contributors": [String],       // Google IDs of non-owner  contributors
        "description": String,
        "comments": [commentSchema],
        "_id": String,                  // Document ID
        "title": String,
        "owner": String,                // Google ID of owner
        "__v": Number
    }
}
```
**Response (Fail, 404):**
```json
{
    "resp": "Project :id not found"
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```

### /api/addProject
**Type:** POST
**Description:** Creates a user profile.
**Body:**
```json
 {
    "title" : String,           // REQUIRED
    "owner" : String,           // REQUIRED, id of creator
    "contributors" : [String],  // id of non-creator contributors
    "description" : String
 }
```
**Response (Success):**
```json
{
    "resp" : {
        "score": Number,                
        "contributors": [String],       // Google IDs of non-owner  contributors
        "description": String,
        "comments": [commentSchema],
        "_id": String,                  // Document ID
        "title": String,
        "owner": String,                // Google ID of owner
        "__v": Number
    }
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```
### /api/updateProject/:id
**Type:** POST
**Description:** Updates a project.
**Body:**
```json
{
    [Whatever project fields you wish to update with their new value]
}
```
**Response (Success):**
```json
{
    "resp" : {
        "score": Number,                
        "contributors": [String],       // Google IDs of non-owner  contributors
        "description": String,
        "comments": [commentSchema],
        "_id": String,                  // Document ID
        "title": String,
        "owner": String,                // Google ID of owner
        "__v": Number
    }
}
```
**Response (Fail, 404):**
```json
{
    "resp": "Project :id not found"
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```
---
## Search
### /search/courses
**Type:** POST
**Description:** Search udemy for specific courses. Returns top 10 results.
**Body:**
```json
 {
    "term" : String,           // The search term for your query
 }
```
**Response (Success):**
```json
{
    "resp" : [
        {
            "title" : String,
            "url" : String,
            "thumbnail" : String,
            "description" : String
        },
        ...
    ] 
}
```
**Response (Fail, 500):**
```json
{
    "resp": {Error Object}
}
```