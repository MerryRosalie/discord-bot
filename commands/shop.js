const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Shop } = require("../db_objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Display all available items for purchase."),
  async execute(interaction) {
    const items = await Shop.findAll();
    const allItems = items.map(item => {
      return {
        name: item.name,
        value: `\`\`\`${item.cost} Mora 🪙\`\`\``,
        inline: true
      }
    });
    const embed = new EmbedBuilder()
      .setTitle("Welcome to the shop 🍃")
      .setDescription("Here are all the available items for purchase:")
      .addFields(allItems)
      .setColor(0xFFA500)
      .setFooter({ text: "Kaedehara Kazuha", iconURL: interaction.client.user.displayAvatarURL() });
    interaction.reply({
      embeds: [embed]
    })
  }
}