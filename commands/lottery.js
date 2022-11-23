const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users, Lottery } = require('../db_objects.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lottery')
    .setDescription('Join the lottery for only 50 Mora daily for a chance to get large sum of Mora 🪙.'),
  async execute(interaction) {
    const user = await Users.findOne({
      where: {
        userId: interaction.user.id,
      },
    });
    // Return early when user is new or user balance is not enough
    if (!user || user.balance < 50) {
      return interaction.reply({
        content: 'The lottery costs **50 Mora** to join. Please get enough Mora first to join.',
      });
    }
    // Return early if user has registered for Lottery
    const userRegistered = await Lottery.findOne({
      where: {
        userId: interaction.user.id,
      },
    });
    const todayMidnight = new Date().setHours(0, 0, 0);
    const timeDiff = Math.abs(todayMidnight - Date.now());
    const hours = Math.floor(timeDiff / 1000 / 3600);
    const minutes = Math.ceil((timeDiff / 1000 % 3600) / 60) % 60;
    if (userRegistered) {
      return interaction.reply({
        content: `You have signed up for the lottery. Please wait for **${hours} hours ${minutes} minutes** to know the result.`,
      });
    }
    // Add user to lottery
    await Lottery.create({
      userId: interaction.user.id,
    });
    // Reduce the balance of the user
    user.balance -= 50;
    user.save();
    // Reply with embed
    const embed = new EmbedBuilder()
      .setTitle('Thanks for joining the lottery!')
      .setDescription(`Please wait for **${hours} hours ${minutes} minutes** to know the result.`)
      .setColor(0xFFA500);
    interaction.reply({
      embeds: [embed],
    });
  },
};