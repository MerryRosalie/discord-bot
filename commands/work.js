const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Users } = require("../db_objects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Help the jobless Kazuha earn some money 😔"),
  async execute(interaction) {
    let user = await Users.findOne({ where: { userId: interaction.user.id }});
    // Return early if it hasn't been a hour since the user worked
    if (!user) {
      user = await Users.create({ 
        userId: interaction.user.id,
        balance: 0
      });
    }
    if (user.previousWorkTime !== null && Math.abs(Date.now() - user.previousWorkTime) > 3600) {
      interaction.reply({
        content: "I appreciate your eagerness, but shall we take a one-hour break? Afterall, a weary mind is a recipe for flavorless food.",
      });
      return;
    }
    // Add a random amount of money from 100 to 200
    const amount = Math.floor(Math.random() * 200) + 100;
    // Add balance to user when user exists
    user.balance += Number(amount);
    user.save();
    // Reply with embed
    const embed = new EmbedBuilder()
      .setTitle("Thanks for helping me out!")
      .setDescription("Here is the share that I promised you.")
      .addFields([{
        name: `You just gained ${amount} Mora 🪙`,
        value: `Your balance is now ${user.balance} Mora 🪙.`
      }])
      .setColor(0xFFA500)
    interaction.reply({ 
      embeds: [embed] 
    });
    // Set time to Date.now()
    user.previousWorkTime = Date.now();
    user.save();
  },
}