
var express = require('express');
var router = express.Router();
const db = require('../lib/db');

class ListItemsController {
  static async createNoteItem(listId, text) {
    let maxRank = 0;
    try {
      maxRank = await db.models.listitems.max('rank', {
        where: {
          list_id: listId
        }
      });
    } catch (error) {
      console.error(error.message);
      return null;
    }
    console.log(`found max Rank = ${maxRank}`);
    try {
      let item = await db.models.listitems.create({
        text: text,
        rank: maxRank + 1,
        list_id: listId          // Required (must reference existing list in todolists table)
      });
      console.log(`Created list item: ${JSON.stringify(item)}`);
      return item;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  static async updateNoteItem(itemId, text) {
    try {
      let item = await db.models.listitems.update(
        { text: text },
        { where: { item_id: itemId } }
      );
      console.log(`Updated list item: ${JSON.stringify(item)}`);
      return item;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  static async deleteNoteItem(itemId) {
    try {
      let item = await db.models.listitems.destroy(
        { where: { item_id: itemId } });
      console.log(`Updated list item: ${JSON.stringify(item)}`);
      return item;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  static async toggleState(itemId) {
    try {
      let item = await db.models.listitems.update(
        {
          done: db.sequelize.literal('NOT "done"')
        },
        {
          where: {
            item_id: itemId
          }
        });
      console.log(`Updated list item: ${JSON.stringify(item)}`);
      return item;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
}

router.post('/', async (req, res) => {
  try {
    const { owner, text } = req.body;
    console.log(`post method received data: ${owner}, ${text}`);
    const item = await ListItemsController.createNoteItem(owner, text);
    console.log(`Created item: ${JSON.stringify(item)}`);
    res.json(item);
    // res.write("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { item_id, text } = req.body;
    console.log(`put method received data: ${item_id}, ${text}`);
    const item = await ListItemsController.updateNoteItem(item_id, text);
    console.log(`updated item: ${JSON.stringify(item)}`);
    res.json(item);
    // res.write("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { item_id } = req.body;
    console.log(`delete method received data: ${item_id}`);
    await ListItemsController.deleteNoteItem(item_id);
    console.log(`deleted item: ${JSON.stringify(item_id)}`);
    res.write("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/toggle/:item_id', async (req, res) => {
  try {
    console.log(`toggle put method received data: ${req.params.item_id}`);
    const item = await ListItemsController.toggleState(req.params.item_id);
    console.log(`updated item: ${JSON.stringify(item)}`);
    res.json(item);
    // res.write("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
