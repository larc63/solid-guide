# solid-guide
URL shortening app

## Layers
Design for first iteration for the system
```mermaid
architecture-beta
    group cdn(cloud)[Client]
    service cdn1(server)[West Coast CDN] in cdn
%%    service cdn2(server)[East Coast CDN] in cdn
    cdn1:R -- L:rp1
%%    cdn2:R -- L:rp2

%%    group frontnet(cloud)[FrontEnd Subnet]
%%    group backnet(cloud)[BackEnd Subnet]
    group rp(cloud)[Reverse Proxy] %% in frontnet
    service rp1(internet)[RP1] in rp
%%    service rp2(internet)[RP2] in rp
%%    junction rpJunction in rp
%%    rp1:B -- T:rp2

    group api(server)[APIs] %% in frontnet
    service api1(server)[root API] in api
    service api2(server)[DB API] in api
    rp1:R -- L:api1
    rp1:R -- L:api2
%%    rp2:R -- L:api1
%%    rp2:R -- L:api2

    group db(disk)[Storage] %% in backnet
    service sql1(disk)[Database] in db
%%    service sql2(disk)[SQL replica] in db

%%    service lb1(server)[Read LB] in db
%%    service db1(disk)[NoSQL A] in db
%%    service db2(disk)[NoSQL B] in db  
    api1:R -- L:sql1
%%    sql1:R -- L:sql2
%%    api1:R -- L:db2
    api2:R -- L:sql1
%%    api2:R -- L:db2

```
* **Reverse Proxy**.  Will route '/' requests o `root API`, otherwise will route to a `read API` node.
* **Root API**. Serves a client front end for adding a new url.
* **DB API**. Returns a 302 redirect to the appropriate url from SQL, otherwise to root api, with error message.
* **Database**. Stores shortcuts.

## Read API
```mermaid
---
title: Read/Write APIs
---
classDiagram
    class WriteController {
        PUT(url: Sting): String
    }
    class DBConnector {
        addURL(id: number, url: String): ErrorCode
        getURL(id: number): ErrorCode // 302 with URL
    }
    WriteController *-- DBConnector : uses
```

## Data Model
```mermaid
---
title: Database Tables
---
classDiagram
    class URLS {
        id: number
        dest: String
        count: number
    }
```


