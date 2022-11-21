import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("inspire")
    .setDescription("Find inspiration and enlightenment in Kazuha's words <3"),
  async execute(interaction) {
    axios
      .get("https://zenquotes.io/api/random")
      .then((res) => {
        const embed = new EmbedBuilder()
          .setTitle("Here is some of my wisdom...")
          .setDescription(res.data[0].q)
          .setImage("https://pa1.narvii.com/8029/f3cde103a70193c05de73e5331b7281c17811b0er1-540-400_hq.gif");
        interaction.reply({ 
          embeds: [embed] 
        });
      })
      .catch((error) => {
        console.error(error);
        interaction.reply({
          content: "Something went wrong, perhaps next time?",
        })
      })
  },
}