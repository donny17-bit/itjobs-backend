<h1 align="center">IT jobs Backend</h1>

## Contents

- [Link](#link)

- [How It Works](#how-it-works)

- [What To Do](#what-to-do)

- [Remote Database](#remote-database)

- [Endpoint](#endpoint)

## Link

- Link Heroku : https://itjobsproject.herokuapp.com/
- Link Cloudinary : "https://res.cloudinary.com/itjobs/image/upload/v1654266716/"

## How It Works ?

1. Download Postman Collection [[here](https://drive.google.com/file/d/1NtuQ54laE0NEfXGzNSnziLFf7SW9z1B9/view?usp=sharing)]
2. Open Your Postman App
3. Import Postman Collection
4. Create Environtments in Postman & Set :

```bash
VARIABLE : itjobs
INITIAL VALUE : https://itjobsproject.herokuapp.com/
CURRENT VALUE : https://itjobsproject.herokuapp.com/
```

5. Test Request

## What To Do ?

1. Register using your real information
2. Open your registered email address
3. Open email and follow the instruction to verify your FazzPay account
4. Login and use the API

## Remote Database

```bash
Hostname = ec2-44-202-197-206.compute-1.amazonaws.com
Port = 3306
Username = fw6thariq
Password = Kdaio83!
```

note: don't drop or remove table and database

## EndPoint

### Module User Auth

**Used for user authentication**

| No. | Method | Endpoint                  | Information                      |
| --- | ------ | ------------------------- | -------------------------------- |
| 1.  | POST   | /auth/user/register       | Used for register new user.      |
| 2.  |        | /auth/user/login          | Used for login into app.         |
| 3.  |        | /auth/user/forgotPassword | Used for forgot password.        |
| 4.  |        | /auth/logout              | Used for logout from system.     |
| 5.  | GET    | /auth/user/verify/:key    | Used for activating new account. |
| 6.  | PATCH  | /auth/user/resetPassword  | Used for reseting password.      |

### Module Company Auth

**Used for company authentication**

| No. | Method | Endpoint                     | Information                      |
| --- | ------ | ---------------------------- | -------------------------------- |
| 1.  | POST   | /auth/company/register       | Used for register new company.   |
| 2.  |        | /auth/company/login          | Used for login into app.         |
| 3.  |        | /auth/company/forgotPassword | Used for forgot password.        |
| 4.  |        | /auth/logout                 | Used for logout from system.     |
| 5.  | GET    | /auth/company/verify/:key    | Used for activating new account. |
| 6.  | PATCH  | /auth/company/resetPassword  | Used for reseting password.      |

### Module User

**Used for any user feature**

| No. | Method | Endpoint                         | Information                                                |
| --- | ------ | -------------------------------- | ---------------------------------------------------------- |
| 1.  | GET    | /user?page=&limit=&search=&sort= | Used for get all data user for showing in home page.       |
| 2.  |        | /user/:userId                    | Used for get user by id                                    |
| 3.  | PATCH  | /user/updatePassword/:userId     | Used to change password for user.                          |
| 4.  |        | /user/updateProfile/:userId      | Used to change any info for example name and phone number. |
| 5.  |        | /user/updateImage/:userId        | Used to change profile picture for user.                   |
| 6.  | DEL    | /user/image/:userId              | Used to delete profile picture for user.                   |

### Module Company

**Used for any company feature**

| No. | Method | Endpoint                           | Information                                                |
| --- | ------ | ---------------------------------- | ---------------------------------------------------------- |
| 1.  | GET    | /company/:userId                   | Used for get user by id                                    |
| 2.  | PATCH  | /company/updatePassword/:companyId | Used to change password for user.                          |
| 3.  |        | /company/updateProfile/:companyId  | Used to change any info for example name and phone number. |
| 4.  |        | /company/updateImage/:companyId    | Used to change profile picture for user.                   |
| 5.  | DEL    | /company/image/:companyId          | Used to delete profile picture for user.                   |

### Module Experience

**Used for get and search user experience**

| No. | Method | Endpoint                  | Information                           |
| --- | ------ | ------------------------- | ------------------------------------- |
| 1.  | GET    | /experience/:userId       | Used for get experience by user by id |
| 2.  | POST   | /experience/:userId       | Used to create experience user        |
| 3.  | PATCH  | /experience/:userId       | Used for udpate experience user       |
| 4.  | DEL    | /experience/:experienceId | Used to delete experience for user    |

### Module Skill

**Used for get and search user by skill**

| No. | Method | Endpoint        | Information                      |
| --- | ------ | --------------- | -------------------------------- |
| 1.  | GET    | /skill/:userId  | Used for get skill by user by id |
| 2.  | POST   | /skill/:userId  | Used to create user skill        |
| 3.  | DEL    | /skill/:skillId | Used to delete skill for user    |

### Module Experience

**Used for get and search user experience**

| No. | Method | Endpoint            | Information                           |
| --- | ------ | ------------------- | ------------------------------------- |
| 1.  | GET    | /portofolio/:userId | Used for get portofolio by user by id |
| 2.  | POST   | /portofolio/:userId | Used to create portofolio user        |
| 3.  | PATCH  | /portofolio/:userId | Used for udpate portofolio user       |
| 4.  | DEL    | /portofolio/:id     | Used to delete portofolio for user    |

### Module Hire

**Used for company to hire user**

| No. | Method | Endpoint      | Information                     |
| --- | ------ | ------------- | ------------------------------- |
| 1.  | GET    | /hire/:userId | Used for get hire by user by id |
| 2.  | POST   | /hire/:userId | Used to create user hire        |
| 3.  | DEL    | /hire/:hireId | Used to delete hire for company |

### JSON Format

The JSON format of the status pages can be often preferable, for example when the tooling or integration to other systems is easier to achieve via a common data format.

The status values follow the same format as described above - OK, and ERROR Message.

The equivalent to the status key form the plain format is a status key in the root JSON object. Subsystems should use nested objects also having a mandatory status key. Here are some examples:

**succes result**

```
{
    "status": 200,
    "msg": "succes get data",
    "data": [
        {
            "id": "6f349403-4c00-4af8-8998-d14abc27906d",
            "fullName": "Cinta Laura",
            "email": "cinta@gmail.com",
            "password": "$2b$10$xr7.DfLCOkffjgiTvDOs3..8jbJhggezK6RSS7/xK6yslScKhSXT6",
            "noTelp": 987654321,
            "address": "Semarang",
            "role": "freelance",
            "description": "web developer at tokopedia, experience as web developer for 2 years,  able to be fullstack,front end or back end",
            "field": "web developer",
            "image": "profiles/hufghlpfe9vzhzfnzwlt.jpeg",
            "socialMedia": "cintacinta123,cintalaura,cintalaura",
            "status": "notActive",
            "UserOTP": null,
            "createdAt": "2022-06-04T11:07:33.000Z",
            "updatedAt": "2022-06-04T18:15:49.000Z",
            "skill": [
                "HTML"
            ]
        },
    ],
    "pagination": {
        "dataSearchFound": 3,
        "page": 1,
        "totalPage": 3,
        "limit": 10,
        "totalData": 23
    }
}

```

**data null result**

```

{
    "status": 200,
    "msg": "succes get data",
    "data": [],
    "pagination": {
        "dataSearchFound": 30,
        "page": 1,
        "totalPage": 3,
        "limit": 10,
        "totalData": 0
    }
}

```

**error request result**

```
{
    "status": 404,
    "msg": "Data by id 62652aff-46fe-47c5-92c5-55cfd206c5b not found",
    "data": null
}
```

### License

© [itJobs Project ](https://github.com/thariqfarsha/itjobs-backend)
