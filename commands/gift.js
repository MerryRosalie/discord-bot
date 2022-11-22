const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Users, Shop, UsersShop } = require("../db_objects");
const { Op } = require('sequelize');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gift")
    .setDescription("Gift someone an item from your inventory.")
    .addStringOption((option) => 
      option.setName("item")
        .setDescription("The name of the item you want to give.")
        .setRequired(true)
    )
    .addStringOption((option) => 
      option.setName("user")
        .setDescription("The discord tag of the targeted user (Case-sensitive).")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Get item based on item name
    const itemName = interaction.options.getString("item");
    const item = await Shop.findOne({ 
      where: { 
        name: { 
          [Op.like]: itemName
        }
      } 
    });
    // Return early if item doesn't exists
    if (!item) {
      interaction.reply("Item doesn't exists.");
      return;
    }
    // Find receiver
    const allMembers = await interaction.guild.members.fetch();
    const receiverExists = allMembers.find(member => {
      return member.user.tag === interaction.options.getString("user");
    });
    // Return early if receiver can't be found
    if (!receiverExists) {
      interaction.reply("Can't recognize target user.");
      return;
    }
    const receiverId = receiverExists.id;
    // Get sender
    const sender = await Users.findOne({
      where: {
        userId: interaction.user.id
      }
    });
    // Return early if user is not in database yet
    if (!sender) {
      return interaction.reply({
        content: `You don't have enough to gift the item **${item.name}**.`,
      })
    }
    // No items in inventory
    const items = await sender.getItems();
    if (!items.length) {
      return interaction.reply({
        content: `You don't have enough to gift the item **${item.name}**.`
      });
    }
    // Item is not enough in inventory
    const targetItem = items.find((userItem) => {
      return userItem.item.name.toLowerCase() === item.name.toLowerCase();
    });
    if (!targetItem) {
      return interaction.reply({
        content: `You don't have enough to gift the item **${item.name}**.`
      });
    }
    let receiver = await Users.findOne({
      where: {
        userId: receiverId
      }
    });
    // Make a new account if receiver is a new user
    if (!receiver) {
      receiver = await Users.create({ 
        userId: receiverId,
        balance: 0
      });
    }
    // Reduce the amount of items in sender inventory
    targetItem.amount--;
    targetItem.save();

    // if targetItem reaches zero, deletes it from inventory
    if (targetItem.amount === 0) {
      await UsersShop.destroy({ where: {
        userId: interaction.user.id,
        itemId: item.itemId
      }});
    }

    // Add items to receiver inventory
    await receiver.addItem(item);

    const embed = new EmbedBuilder()
      .setTitle("Gift successfully sent!")
      .setDescription(`A **${item.name}** has successfully been sent to **${interaction.options.getString("user")}**.`)
      .setColor(0xFFA500);
    interaction.reply({
      embeds: [embed]
    })
  }
}