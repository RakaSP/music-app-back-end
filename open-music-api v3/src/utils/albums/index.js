const mapDBToModelAlbum = ({
  id, name, year, cover,
}) => ({
  id,
  name,
  year,
  coverUrl: cover,
});

module.exports = { mapDBToModelAlbum };
