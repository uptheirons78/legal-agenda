const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Models
const User = require('../models/User');
const Client = require('../models/Client');
const Folder = require('../models/Folder');

// @route     GET api/folders
// @desc      Get All User Folders
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({
      user: req.user.id,
    })
      .populate({ path: 'client', select: 'name' })
      .sort({ folder_number: -1 });

    res.json(folders);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/folders
// @desc      Add New Folder
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('client', 'A Client ID is required')
        .not()
        .isEmpty(),
      check('folder_number', 'Folder Number is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { client, folder_number, type } = req.body;

    try {
      const newFolder = new Folder({
        client,
        folder_number,
        type,
        user: req.user.id,
      });

      const folder = await newFolder.save();

      res.json(folder);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/folders/:folderId
// @desc      Update Folder
// @access    Private
router.put('/:folderId', auth, async (req, res) => {
  const { folder_number, type } = req.body;

  // Build a contact object
  const folderFields = {};
  if (folder_number) folderFields.folder_number = folder_number;
  if (type) folderFields.type = type;

  try {
    let folder = await Folder.findById(req.params.folderId);

    if (!folder) return res.status(404).json({ msg: 'Folder Not Found' });

    // Make sure user owns the folder to update
    if (folder.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }

    folder = await Folder.findByIdAndUpdate(
      req.params.folderId,
      { $set: folderFields },
      { new: true }
    );

    res.json(folder);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/folders/:folderId
// @desc      Delete Folder
// @access    Private
router.delete('/:folderId', auth, async (req, res) => {
  try {
    let folder = await Folder.findById(req.params.folderId);

    if (!folder) return res.status(404).json({ msg: 'Client not found' });

    // Make sure user owns the client to update
    if (folder.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }

    await Folder.findByIdAndRemove(req.params.folderId);

    res.json({ msg: 'Folder Deleted' });
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/folders/:folderId
// @desc      Get A Single Folder of a Specific User
// @access    Private
router.get('/:folderId', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.folderId).populate({
      path: 'client',
    });
    res.json(folder);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
