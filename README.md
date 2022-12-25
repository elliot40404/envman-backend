# ENVMAN BACKEND

## Directory Tree

```sh
.
├── README.md
├── index.js
├── package-lock.json
├── package.json
├── router
│   └── v1
│       └── account.routes.js
├── controllers
│   └── account.controller.js
├── services
│   └── account.service.js
├── db
│   ├── db.js
│   └── models
│       └── account.js
├── middleware
│   ├── auth.js
│   └── errorHandler.js
├── helpers
│   └── helper.js
├── utils
│   └── utils.js
├── conf.d
│   └── api.conf
├── docker-compose.yml
├── dockerfile
├── ecosystem.config.cjs

```

## API Documentation

---

TEST URL: [http://localhost:4000/api/](http://localhost:4000/api/)

<!-- LIVE URL: []() -->

Default perPage = `20`

Default page = `1`

### Create Account

```http
POST /v1/account
```

| Parameter | Type   | Position            | Description         | Optional |
| :-------- | :----- | :------------------ | :------------------ | :------: |
| file      | file   | multipart/form-data | file to be uploaded |  false   |
| studioId  | string | query Param         | studioId            |  false   |
