const { EmbedBuilder } = require("@discordjs/builders");
const { CronJob } = require("cron");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ 
      status: "online" 
    });
    // Start sending daily scheduled messages
    const dailyReminder = new CronJob("00 00 00 * * *", () => {
      const channel = client.channels.cache.find(channel => channel.name === "test-kazuha-bot");
      console.log("Daily reminders sent!");
      const embed = new EmbedBuilder()
        .setTitle("Rise and shine...")
        .setDescription("The birdsong at daybreak is nature's gift to us. Let us go. Our journey begins anew.")
        .addFields({
          name: "Genshin daily check-in",
          value: "Don't forget to do the daily genshin check-in too. https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481"
        })
        .setImage("https://img1.picmix.com/output/pic/normal/7/5/7/2/10472757_ee699.gif")
        .setColor(0xFFA500)
        .setAuthor({ name: "Kaedehara Kazuha", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      channel.send({ embeds: [embed] });
    }, null, true, "Australia/Sydney");
    dailyReminder.start();
  }
}