const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Users } = require("../db_objects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Display all items in your inventory."),
  async execute(interaction) {
    let user = await Users.findOne({
      where: {
        userId: interaction.user.id
      }
    });
    // Create new user when user doesn't exists yet
    if (!user) {
      user = await Users.create({ 
        userId: interaction.user.id,
        balance: 0
      });
    }
    const items = await user.getItems();
    if (!items.length) {
      return interaction.reply({
        content: "You currently have nothing in your inventory."
      });
    }

    const inventoryItems = items.map((userItem) => {
      return {
        name: userItem.item.name,
        value: `\`\`\`${userItem.amount}\`\`\``,
        inline: true
      }
    })
    const embed = new EmbedBuilder()
      .setTitle("List of your inventory")
      .setDescription("You currently have these in your inventory:")
      .addFields(inventoryItems)
      .setColor(0xFFA500);
    interaction.reply({
      embeds: [embed]
    })
  }
}