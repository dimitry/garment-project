var Main = (function() {
  return {
    player: null,

    init: function() {
      // Youtube
      $('.action-player').click(function(e) {
        e.preventDefault();
        Main.player.playVideo();
        $('.player').fadeIn(333);
      });
      // Nav
      $('.mobile-menu').click(function(e) {
        $('.mobile-nav').fadeIn(333);
      });
      $('.mobile-nav .close').click(function(e) {
        $('.mobile-nav').fadeOut(333);
      });
    },

    onYouTubeIframeAPIReady: function() {
      // Instantiate new Youtube player
      if ($('.action-player').length > 0) {
        var videoId = $('.action-player').attr('href').match(/(youtu.be\/|youtube.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&\"\'>]+)/);
        videoId = videoId[5];
        Main.player = new YT.Player($('.player').get(0), {
          height: '100%',
          width: '100%',
          videoId: videoId,
          events: {
            'onStateChange': function(event) {
              // Monitor if video ended and close popup
              if (event.data === YT.PlayerState.ENDED) {
                $('.player').fadeOut(333);
              }
            }
          }
        });
      }
    }
  };
}());