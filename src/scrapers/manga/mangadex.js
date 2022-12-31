const fetchURL = require('../../helpers/fetchURL');

const getManga = async (item) => {
  const APItitle = item.split(' ').join('%20');
  const title = item.split(' ').join('-');
  const mangaApi = `https://api.mangadex.org/manga?title=${APItitle}&limit=5&includes[]=author&includes[]=cover_art&order[relevance]=desc`;

  const mangaJSON = await fetchURL(mangaApi).catch((e) => {
    throw e;
  });

  // if no matching title found
  if (mangaJSON.total === 0) {
    throw Error('No Manga Found');
  }

  return mangaJSON.data;
};

const parseManga = async (manga, item) => {
  const title = item.split(' ').join('-');
  const mangaID = manga.id;
  const coverArtFile = manga.relationships.filter(
    (relationship) => relationship.type === 'cover_art'
  )[0].attributes.fileName;
  const coverArtID = manga.relationships.filter(
    (relationship) => relationship.type === 'cover_art'
  )[0].id;
  const mangaAuthor = manga.relationships.filter(
    (relationship) => relationship.type === 'author'
  )[0].attributes.name;
  const mangaName = manga.attributes.title.en;
  const mangaStatus = manga.attributes.status;

  const mangaChaptersApi = `https://api.mangadex.org/manga/${mangaID}/feed?limit=96&order[volume]=desc&order[chapter]=desc`;
  const mangaChapterJSON = await fetchURL(mangaChaptersApi).catch((e) => {
    throw e;
  });

  const parsedManga = {};
  parsedManga.newestChapterNumber = mangaChapterJSON.data[0].attributes.chapter;
  parsedManga.newestChapterID = mangaChapterJSON.data[0].id;
  parsedManga.imageURL = `https://mangadex.org/covers/${mangaID}/${coverArtFile}`;
  parsedManga.newestChapterReadableAt =
    mangaChapterJSON.data[0].attributes.readableAt;
  parsedManga.author = mangaAuthor;
  parsedManga.id = mangaID;
  parsedManga.URL = `https://mangadex.org/title/${mangaID}/${title}`;
  parsedManga.name = mangaName;
  parsedManga.status = mangaStatus;

  return parsedManga;
};

const mangadexScraper = async (item) => {
  const [manga] = await getManga(item);

  return parseManga(manga, item);
};

module.exports = mangadexScraper;
