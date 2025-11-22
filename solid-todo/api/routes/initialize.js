const express = require('express');
const db = require('../lib/db');

const router = express.Router();


/* GET home page. */
router.get('/', async function (req, res, next) {

  try {
    console.log('create list');
    const newList = await db.models.todolists.create({
      title: 'Shopping List'
    });

    console.log(`Created list ${newList.list_id} successfully!`);

    // console.log('create list item');
    // const newItem = await db.models.listitems.create({
    //   owner_id: newList.list_id,        // Required
    //   text: 'Buy groceries',
    //   rank: 1,
    //   list_id: 5          // Required (must reference existing list in todolists table)
    // });

    // console.log('Created list item successfully!');

  } catch (error) {
    console.error('Unable to create list item:', error);
    console.error(error.message);
  }

  res.send('Hello there');
});

module.exports = router;
