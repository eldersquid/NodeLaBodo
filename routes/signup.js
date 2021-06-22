const express = require('express');
const router = express.Router();
const Signup = require('../models/Signup');
const alertMessage = require('../helpers/messenger.js');