const mapDBToModelSong = ({ song_id, title, performer }) => ({
  id: song_id,
  title,
  performer,
});

module.exports = { mapDBToModelSong };
