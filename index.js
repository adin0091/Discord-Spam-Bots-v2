#!/usr/bin/env node
const { Bot } = require('./src/Bot');
const { message, delay, bot, invite } = require('./config/config.json');

Bot.init(message, delay, bot, invite);
