const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Users } = require('../db_objects');

const OPTIONS = {
  ROCK: 0,
  PAPER: 1,
  SCISSOR: 2
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Plays rock paper scissors.')
    .addIntegerOption((option) =>
      option.setName('amount')
        .setDescription('Amount of mora you want to bet.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 250) {
      const embed = new EmbedBuilder()
        .setDescription('The amount you can bet can only be within 1 to 250 Mora')
        .setColor(0xFFA500) 
      return interaction.reply({
        embeds: [embed],
      });
    }
    // Get user
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
    if (amount > user.balance) {
      return interaction.reply(`You don't have enough Mora to bet ${amount} Mora.`);
    }
    user.balance -= amount;
    // Send rps buttons to user
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('rock')
          .setLabel('🪨'),
        new ButtonBuilder()
          .setCustomId('paper')
          .setLabel('📄'),
        new ButtonBuilder()
          .setCustomId('scissor')
          .setLabel('✂️')
      );
    interaction.reply({
      content: 'Good luck!',
      components: [row],
      ephemeral: true
    });
    // Check interaction is clicked within time limit
    const delay = new Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, 60000);
    });
    const response = await Promise.race([interaction.isButton(), delay]);
    if (!response) {
      const embed = new EmbedBuilder()
        .setDescription('Sorry, I have been waiting too long...')
        .setColor(0xFFA500) 
      return interaction.editReply({
        embeds: [embed],
      });
    }
    // Pick either rock, paper, or scissors
    const botPick = Math.random() * Object.keys(OPTIONS).length;
    const userPick = interaction.customId;
    // Register previousRpsTime
    user.previousRpsTime = Date.now();
    // Check win/tie/lose
    if ((userPick > botPick && Math.abs(userPick - botPick) === 1) ||
      (OPTIONS.SCISSOR === userPick && OPTIONS.ROCK === botPick)) {
      const embed = new EmbedBuilder()
        .setDescription(`You win! You win an extra ${amount} Mora!`)
        .setColor(0xFFA500) 
      user.balance += (2 * amount);
      return interaction.editReply({
        embeds: [embed],
      });
    } else if (userPick === botPick) {
      const embed = new EmbedBuilder()
        .setDescription('It\'s a tie! You won back your money.')
        .setColor(0xFFA500) 
      user.balance += amount;
      return interaction.editReply({
        embeds: [embed],
      });
    }
    const embed = new EmbedBuilder()
      .setDescription('You lost! You lost the money you bet.')
      .setColor(0xFFA500) 
    return interaction.editReply({
      embeds: [embed],
    });
  },
};