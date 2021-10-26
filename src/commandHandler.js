const fs = require('fs');
const getAllFiles = require('./getAllFiles');

module.exports = (client, Collection, { commandsDir, eventsDir }) => {
    const eventFiles = getAllFiles(eventsDir, '.js');

    for (const file of eventFiles) {
        const event = require(file[0]);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    client.commands = new Collection();
    const commandFiles =  getAllFiles(commandsDir, '.js'); // fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(file[0]);
        client.commands.set(command.data.name, command);
    };

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        const propertiesObject = {
            interaction,
            guild: interaction.guild,
            member: interaction.member,
            user: interaction.user,
            channel: interaction.channel,
            client
        };

        try {
            await command.execute(propertiesObject);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        };
    });
};