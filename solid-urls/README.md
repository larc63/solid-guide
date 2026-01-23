# solid-urls
URL shortening app

## Requirements

1. Users can add a url and get a shortened version of the url in the form: `   `[base-url]/[id]` where id is the value that is used on the database
1. When a shortened url is requested, the server redirects to the long url previously entered.
1. If a shortened url doesn't have a long version associated with it, the user is redirected to the (angular) page to add a new url, with an error in it's querystring



## Layers
Design for first iteration for the system
```mermaid
architecture-beta
    group client(cloud)[Client]
    service cdn1(server)[Client] in client
    cdn1:R -- L:rp1

    group rp(cloud)[Reverse Proxy] %% in frontnet
    service rp1(internet)[RP1] in rp

    group api(server)[APIs] %% in frontnet
    service api1(server)[Angular on Nginx] in api
    service api2(server)[Spring Boot on Tomcat] in api
    rp1:R -- L:api1
    rp1:R -- L:api2

    group db(disk)[Storage] %% in backnet
    service sql1(disk)[Database] in db
    api1:R -- L:sql1
    api2:R -- L:sql1

```
* **Reverse Proxy**.  Will route '/' requests o `Angular on Nginx`, otherwise will route to a `read API` node in Sprint Boot.
* **Angular on Nginx**. Serves a client front end for adding a new url.
* **Read API**. Returns a 302 redirect to the appropriate url from SQL, otherwise to root api, with error message.
* **Database**. Stores shortcuts in a simple id -> url table

## Read API
```mermaid
---
title: Read/Write APIs
---
classDiagram
    class WriteController {
        PUT(url: Sting): String
        GET(id: String): HttpResult // 302 with URL
    }
    class DBConnector {
        addURL(id: number, url: String): ErrorCode
        getURL(id: number): String 
    }
    WriteController *-- DBConnector : uses
```

## Data Model
```mermaid
---
title: Database Table
---
classDiagram
    class URLS {
        id: number
        dest: String
        count: number
    }
```


