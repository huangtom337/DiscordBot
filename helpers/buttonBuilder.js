const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');

const primaryButton = (id, label) => {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(id)
      .setLabel(label)
      .setStyle(ButtonStyle.Primary)
  );
};

module.exports = { primaryButton };
