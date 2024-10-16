class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(
        message.content.toString(),
      );
      const playlists = await this._playlistService.getPlaylist(playlistId);

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlists),
      );
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Listener;
