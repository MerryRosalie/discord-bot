const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Users } = require("../db_objects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Help the jobless Kazuha earn some money 😔"),
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
    // Return early when it hasn't been 1 hour since the user worked
    if (user.previousWorkTime !== null) {
      const timeDiff = Math.abs(Date.now() - user.previousWorkTime);
      if (timeDiff < 3600000) {
        const waitTime = Math.abs(3600000 - timeDiff);
        return interaction.reply({
          content: `I appreciate your eagerness, but let's rest for another **${Math.ceil(waitTime / 1000 / 60)} minutes**. Afterall, a weary mind is a recipe for flavorless food.`,
        });
      }
    }
    // Add a random amount of money from 100 to 200
    const amount = Math.floor(Math.random() * (200 - 100 + 1) + 100);
    // Add balance
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