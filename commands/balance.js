const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Users } = require("../db_objects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Get the amount of mora you currently have."),
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
    // Reply with embed
    const embed = new EmbedBuilder()
      .setTitle("Your balance ✨")
      .setDescription(`You currently have ${user.balance} Mora 🪙.`)
      .setColor(0xFFA500)
    interaction.reply({ 
      embeds: [embed] 
    });
  },
}