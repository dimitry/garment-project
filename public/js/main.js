var Main = (function() {
  return {
    player: null,
    closetId: null,
    garments: [],
    selectedGarments: [],

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
      $('.mobile-nav').on('touchmove', function(e) {
        e.preventDefault();
      });
      // Error
      $('.error .close').click(function(e) {
        e.preventDefault();
        $(this).parents('.error').remove();
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
    },

    initCloset: function() {
      $('.wardrobe .items .action-toggle').click(function(e) {
        e.preventDefault();
        var itemEl = $(this).parents('.item');
        var garmentId = itemEl.data('garment-id');
        var garmentIndex = Main.selectedGarments.indexOf(garmentId);
        if (garmentIndex === -1) {
          itemEl.find('.container').addClass('selected');
          itemEl.find('.button').addClass('selected').find('img').attr('src', '/imgs/selected.svg');
          Main.selectedGarments.push(garmentId);
          Main.addGarment(garmentId);
        } else {
          itemEl.find('.container').removeClass('selected');
          itemEl.find('.button').removeClass('selected').find('img').attr('src', '/imgs/add.svg');
          Main.selectedGarments.splice(garmentIndex, 1);
          Main.removeGarment(garmentId);
        }
      });

      // Remove items
      $(document.body).on('click', '.order-menu a.action-remove', function(e) {
        e.preventDefault();
        var garmentId = $(this).parents('.item').data('garment-id');
        var garmentIndex = Main.selectedGarments.indexOf(garmentId);
        if (garmentIndex !== -1) {
          Main.selectedGarments.splice(garmentIndex, 1);
        }

        var itemEl = $('.wardrobe .item').filter(function() {
          return $(this).data('garment-id') == garmentId;
        });
        if (itemEl.length === 0) {
          return;
        }
        itemEl = $(itemEl[0]);
        itemEl.find('.container').removeClass('selected');
        itemEl.find('.button').removeClass('selected').find('img').attr('src', '/imgs/add.svg');
        Main.removeGarment(garmentId);
      });

      // Submit
      $('.order-menu a.action-submit').click(function(e) {
        e.preventDefault();
        if (Main.selectedGarments.length === 0) {
          alert('Please select at least one item.');
          return;
        }

        var url = '/closets/' + Main.closetId + '/submit';
        var data = {
          garments: Main.selectedGarments
        };
        $.post(url, data, function(data, status, jqXHR) {
          if (data.success === true) {
            alert('Thank you! Your order has been submitted');
            window.scrollTo(0, 0);
            window.location.reload();
          } else {
            alert('Uhoh! Could not send your order. Please try again later.');
          }
        });
      });

      // Notify by email
      $('.action-notify').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to notify the user that the closet is ready?')) {
          var url = '/closets/' + Main.closetId + '/notify';
          $.post(url, function(data, status, jqXHR) {
            if (data.success === true) {
              alert('User has been notified!');
              window.location.href = '/closets/' + Main.closetId + '/login';
            } else {
              alert('Uhoh! Could not notify the user. Please try again later.');
            }
          });
        }
      });
    },

    addGarment: function(garmentId) {
      Main.updateHeaderItemCount();

      // Get the garment
      var garments = Main.garments.filter(function(garment) {
        return garment._id == garmentId;
      });
      var garment = garments.length > 0 ? garments[0] : null;

      // Insert html
      var itemEl = $('.sample-item').clone();
      itemEl.removeClass('sample-item').data('garment-id', garmentId);
      itemEl.find('.item-img img').attr('src', garment.image.url);
      itemEl.find('.item-info .item-name').text(garment.name);
      itemEl.find('.item-info .item-number').text('#' + garment.sku);
      itemEl.appendTo($('.order-menu .menu .items'));
    },

    removeGarment: function(garmentId) {
      Main.updateHeaderItemCount();
      var itemEl = $('.order-menu .menu .items .item').filter(function() {
        return $(this).data('garment-id') == garmentId;
      });
      if (itemEl.length > 0) {
        $(itemEl[0]).remove();
      }
    },

    updateHeaderItemCount: function() {
      $('#itemCount').text(Main.selectedGarments.length);
    },

    initCheckout: function() {
      // Toggle checkout
      $('header a.action-show-checkout, .order-menu .header a.button').click(function(e) {
        e.preventDefault();
        $('.order-menu').toggleClass('active');
      });
    }
  };
}());