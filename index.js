const { Client, Collection, Intents } = require('discord.js');
const commandHandler = require('./src/commandHandler')
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const token = process.env.TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

commandHandler(client, Collection, {
    commandsDir: path.join(__dirname, 'commands'),
    eventsDir: path.join(__dirname, 'events')    
});

client.login(token);