import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Display informations on all available commands."),
  async execute(interaction) {
    const commands = interaction.client.commands.map((command) => {
      return {
        name: `/${command.data.name}`,
        value: command.data.description
      }
    });
    const embed = new EmbedBuilder()
      .setTitle("List of commands")
      .setDescription("What can I do to help you?")
      .addFields(commands)
      .setColor(0xFFA500);
    interaction.reply({ 
      embeds: [embed] 
    });
  },
}