# datagrid

Postgres / Kinto / React Datagrid / React-Json-Forms experiment.

## Prerequisites

Python 3, Node.js, httpie

## Run with Docker

```sh
$ git clone https://github.com/jastr945/datagrid.git
$ cd datagrid
$ cp .temp.env .env
```

Change your credentials in ```.env``` and run:

```sh
$ [sudo] docker-compose up --build -d
```

Create a new Kinto user:

```sh
$ curl -X PUT http://localhost:8888/v1/accounts/<insert REACT_APP_KINTO_USER value> -d '{"data": {"password": "<insert REACT_APP_KINTO_PASSWORD value>"}}' -H 'Content-Type:application/json'
```

Go to http://localhost:8888/admin, log in with your new Kinto credentials.
Create a new collection 'test-1' with the default schema:

```
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "title": "Title",
      "description": "Short title"
    },
    "content": {
      "type": "string",
      "title": "Content",
      "description": "Provide details..."
    }
  }
}
```

Go to http://localhost:9000 to see the app.
