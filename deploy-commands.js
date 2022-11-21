import fs from 'fs';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Configure environment variables
dotenv.config();

// Set up paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, 'commands');

// Add commands
const commands = [];
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { default: command } = await import(filePath);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Deploy commands
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.APPLICATION_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  }
  catch (error) {
    console.error(error);
  }
})();