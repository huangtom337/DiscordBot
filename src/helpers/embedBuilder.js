const { EmbedBuilder } = require('discord.js');

const embedBuilder = (
  name,
  url,
  siteName,
  price = 0,
  thumbnailImage = '',
  inStore = '',
  online = ''
) => {
  const embed = new EmbedBuilder()
    .setColor(0xeaddca)
    .setTitle(name)
    .setURL(url)
    .setAuthor({
      name: `${siteName}`,
      iconURL: 'https://i.imgur.com/AfFp7pu.png',
    })
    .setTimestamp();

  if (price) {
    embed.setDescription(`This item is listed at $${price}`);
  }

  if (thumbnailImage) {
    embed.setThumbnail(thumbnailImage);
  }

  if (inStore && online) {
    embed.addFields(
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
    );
  }

  return embed;
};

module.exports = embedBuilder;
