var express = require('express');
var router = express.Router();
const db = require('../lib/db');

class TODOListController {
  /**
   * Description
   * @param {any} userId
   * @returns {any}
   */
  static async getNotes(userId) {
    try {
      // TODO: change to find, to later iterate on all notes for a given user
      const list = await db.models.todolists.findOne({
        where: { list_id: 1 }
      });
      console.log(`Found list ${list}`);

      const items = await db.models.listitems.findAll({
        where: { list_id: 1 }
      });
      console.log(`found ${items.length} items`);
      list.setDataValue('items', items);
      return list;
    } catch (error) {
      return null;
    }
  }
}

/* GET notes for user listing. */
router.get('/', async function (req, res, next) {
  try {
    const list = await TODOListController.getNotes(1);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
