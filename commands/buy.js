const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users, Shop } = require('../db_objects.js');
const { Op } = require('sequelize');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy something from the shop.')
    .addStringOption((option) =>
      option.setName('item')
        .setDescription('The item you want to buy.')
        .setRequired(true),
    ),
  async execute(interaction) {
    const itemName = interaction.options.getString('item');
    const item = await Shop.findOne({
      where: {
        name: {
          [Op.like]: itemName,
        },
      },
    });
    // Return early if item doesn't exists
    if (!item) {
      interaction.reply('Sorry, the item doesn\'t exist.');
      return;
    }
    // Return early when the cost of the item is higher than
    // user balance
    let user = await Users.findOne({
      where: {
        userId: interaction.user.id,
      },
    });
    // Create new user when user doesn't exists yet
    if (!user) {
      user = await Users.create({
        userId: interaction.user.id,
        balance: 0,
      });
    }
    if (item.cost > user.balance) {
      interaction.reply(`The **${item.name}** costs **${item.cost} Mora** 🪙 but you currently only have **${user.balance} Mora** 🪙.`);
      return;
    }

    await user.addItem(item);
    const prevBalance = user.balance;

    // Edit balance
    user.balance -= item.cost;
    user.save();

    const embed = new EmbedBuilder()
      .setTitle(`You bought ${item.name}!`)
      .setDescription(`Your balance is now **${user.balance}** Mora from **${prevBalance}** Mora 💸.`)
      .setColor(0xFFA500);
    interaction.reply({
      embeds: [embed],
    });
  },
};