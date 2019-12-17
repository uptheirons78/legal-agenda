const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Models
const User = require('../models/User');
const Client = require('../models/Client');

// @route     GET api/clients
// @desc      Get All Users Clients
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find({
      user: req.user.id,
    }).sort({ file_number: -1 });

    res.json(clients);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/clients
// @desc      Add New Client
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('file_number', 'File Number is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, file_number } = req.body;

    try {
      const newClient = new Client({
        name,
        file_number,
        user: req.user.id,
      });
      const client = await newClient.save();
      res.json(client);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/clients/:id
// @desc      Update Client
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const { name, file_number } = req.body;

  // Build a contact object
  const clientFields = {};
  if (name) clientFields.name = name;
  if (file_number) clientFields.file_number = file_number;

  try {
    let client = await Client.findById(req.params.id);

    if (!client) return res.status(404).json({ msg: 'Client not found' });

    // Make sure user owns the client to update
    if (client.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }

    client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: clientFields },
      { new: true }
    );

    res.json(client);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/clients/:id
// @desc      Delete Client
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);

    if (!client) return res.status(404).json({ msg: 'Client not found' });

    // Make sure user owns the client to update
    if (client.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }

    await Client.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Client Deleted' });
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
