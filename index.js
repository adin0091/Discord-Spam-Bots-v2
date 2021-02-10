#!/usr/bin/env node
const { Bot } = require('./src/Bot');
const { message, delay, bot } = require('./config/config.json');

Bot.init(message, delay, bot);