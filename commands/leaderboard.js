const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users } = require('../db_objects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the leaderboard sorted by who has the most coins.'),
  async execute(interaction) {
    const users = await Users.findAll();
    let rank = 0;
    const allUsers = users.map(async (user) => {
      const userTarget = await interaction.client.users.fetch(user.userId);
      console.log(userTarget);
      console.log(user);
      return {
        tag: userTarget.tag,
        balance: user.balance,
      };
    });
    const userLeaderboard = allUsers.sort((user1, user2) => {
      return user2.balance - user1.balance;
    }).map((user) => {
      rank++;
      return {
        name: `${rank} - ${user.tag}`,
        value: `${user.balance} Mora 🪙`,
      };
    }).slice(0, 10);
    const embed = new EmbedBuilder()
      .setTitle('Current richest users 💰')
      .addFields((!userLeaderboard.length ? [{
        name: 'Nothing to show here.',
        value: '\u200b',
      }] : userLeaderboard))
      .setColor(0xFFA500)
      .setFooter({ text: 'Kaedehara Kazuha', iconURL: interaction.client.user.displayAvatarURL() });
    interaction.reply({
      embeds: [embed],
    });
  },
};