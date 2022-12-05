const { EmbedBuilder } = require('@discordjs/builders');
const { CronJob } = require('cron');
const { Lottery } = require('../db_objects');
const Sequelize = require('sequelize');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({
      status: 'online',
    });
    // Start sending daily scheduled messages
    const dailyReminder = new CronJob('00 00 00 * * *', async () => {
      const winnerEntry = await Lottery.findOne({ order: [Sequelize.fn('RANDOM')] });
      let lotteryField = {
        name: 'Today\'s lottery winner is...',
        value: 'No user registered for today\'s lottery',
      };
      if (winnerEntry) {
        const winner = await winnerEntry.getUser();
        const userTag = await client.users.fetch(winner.userId);
        winner.user.balance += 1000;
        winner.user.save();
        lotteryField = {
          name: 'Today\'s lottery winner is...',
          value: `Congratulations, **${userTag.tag}**! You got 1000 Mora 🪙.`,
        };
      }
      // Delete all entry in lottery db
      Lottery.sync({ force: true });
      // Send embed
      const embed = new EmbedBuilder()
        .setTitle('It\'s a new day...')
        .setDescription('The birdsong at daybreak is nature\'s gift to us. Let us go. Our journey begins anew.')
        .addFields({
          name: 'Genshin daily check-in',
          value: 'Don\'t forget to do the daily genshin check-in too. https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481',
        }, lotteryField)
        .setImage('https://img1.picmix.com/output/pic/normal/7/5/7/2/10472757_ee699.gif')
        .setColor(0xFFA500)
        .setAuthor({ name: 'Kaedehara Kazuha', iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      client.channels.cache.filter(channelItem => channelItem.name === 'test-kazuha-bot').map((channel) => {
        channel.send({ embeds: [embed] });
      });
      console.log('Daily reminders sent!');
    }, null, true, 'Australia/Sydney');
    dailyReminder.start();
  },
};