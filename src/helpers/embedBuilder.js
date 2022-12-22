const { EmbedBuilder } = require('discord.js');

const embed = (name, url, siteName, price, thumbnailImage, inStore, online) => {
  return new EmbedBuilder()
    .setColor(0xeaddca)
    .setTitle(name)
    .setURL(url)
    .setAuthor({
      name: `${siteName}`,
      iconURL: 'https://i.imgur.com/AfFp7pu.png',
    })
    .setDescription(`This item is listed at $${price}`)
    .setThumbnail(thumbnailImage)
    .addFields(
      {
        name: 'Purchase In Store',
        value: inStore,
        inline: true,
      },
      {
        name: 'Purchase Online',
        value: online,
        inline: true,
      }
    )
    .setTimestamp();
};

module.exports = embed;
