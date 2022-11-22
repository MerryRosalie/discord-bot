const { Client, GatewayIntentBits, Collection } = require("discord.js");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");

// Configure env variables
dotenv.config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Add commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Add events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  }
  else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Handle commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Setup databases
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite"
});

const Shop = require("./models/Shop.js")(sequelize, Sequelize.DataTypes);
const Users = require("./models/Users.js")(sequelize, Sequelize.DataTypes);
const UsersShop = require ("./models/UsersShop.js")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize.sync({ force }).then(async () => {
	const shop = [
		Shop.upsert({ name: "Tea", cost: 1 }),
		Shop.upsert({ name: "Coffee", cost: 2 }),
		Shop.upsert({ name: "Cake", cost: 5 }),
	];

	await Promise.all(shop);
	console.log("Database is synced");

	sequelize.close();
}).catch(console.error);

// Log in to Discord with token
client.login(process.env.TOKEN);
