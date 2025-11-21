# This is a "Solid" TODO app
All for the sake of practice
## Requiremnts
* Add todo item
* Check off items
* Drag items 
* Persist items in database via sequelize

## Some diagrams

```mermaid
---
title: TODO List Application
---
classDiagram
  class ListItem {
    <<Sequelize Model>>
    id: number
    owner: number
    text: string
    id: rank
  }

  class TODOList {
    <<Sequelize Model>>
    id: number
    owner: number
    title: string
    items: [ListItem]

  }

  class TODOListManager {
    saveLists()
  }

  class User {
    <<Sequelize Model>>
    id: number
  }
    
ListItem--*TODOList
ListItem--TODOListManager
User-->TODOList

```


