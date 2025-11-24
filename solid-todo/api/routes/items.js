
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
        owner_id: listId,        // Required
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
}

/* GET notes for user listing. */
router.post('/', async (req, res) => {
  try {
    const {owner, text} = req.body;
    console.log(`post method received data: ${owner}, ${text}`);
    const item = await ListItemsController.createNoteItem(owner, text);
    console.log(`Created item: ${JSON.stringify(item)}`);
    res.json(item);
    // res.write("ok");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
