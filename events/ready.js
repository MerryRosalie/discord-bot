import { EmbedBuilder } from "@discordjs/builders";
import { CronJob } from "cron";

export default {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    // Start sending daily scheduled messages
    const dailyReminder = new CronJob("45 27 05 * * *", () => {
      const channel = client.channels.cache.get("1044293917346119742");
      const embed = new EmbedBuilder()
        .setTitle("The birdsong at daybreak is nature's gift to us. Let us go. Our journey begins anew.")
        .setDescription("Good Morning! Don't forget your Genshin daily check-in: https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481")
        .setImage("https://img1.picmix.com/output/pic/normal/7/5/7/2/10472757_ee699.gif");
      channel.send({ embeds: [embed] });
    }, null, true, "Australia/Sydney");
    dailyReminder.start();
  }
}