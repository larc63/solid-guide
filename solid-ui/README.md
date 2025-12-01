# This is a "Solid" TODO app
All for the sake of practice
## What it does
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
    item_id: number
    list_id: number
    text: string
    rank: number
  }

  class TODOList {
    <<Sequelize Model>>
    list_id: number
    owner: number
    title: string
    items: [ListItem]

  } 

  class TODOListManager {
    saveLists()
  }

%%  class User {
%%    <<Sequelize Model>>
%%    id: number
%%  }
%%    
ListItem--*TODOList
ListItem--TODOListManager
%% User-->TODOList
```

Initially, this application was going to be front-end only, but things happen, and now there's a back end piece.


# TODO
* [ ] Add button to create multiple notes
* [ ] Add user management
* [ ] Make note title editable
* [ ] Add [federation](https://webpack.js.org/plugins/module-federation-plugin/) to later integrate with host app
* [ ] 
* [ ] 
