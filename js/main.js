/* ===================================================================
 * Infinity - Main JS
 *
 * ------------------------------------------------------------------- */

(function ($) {

  "use strict";

  var cfg = {
    defAnimation: "fadeInUp",    // default css animation		
    scrollDuration: 800,           // smoothscroll duration
    mailChimpURL: 'https://niagara.us15.list-manage.com/subscribe/post?u=735ae37f06ab5db728ca32843&id=5a4c35f5e9'
  },

    $WIN = $(window);


  // Add the User Agent to the <html>
  // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
  var doc = document.documentElement;
  doc.setAttribute('data-useragent', navigator.userAgent);


	/* Preloader 
	 * -------------------------------------------------- */
  var ssPreloader = function () {

    $WIN.on('load', function () {

      // force page scroll position to top at page refresh
      $('html, body').animate({ scrollTop: 0 }, 'normal');

      // will first fade out the loading animation 
      $("#loader").fadeOut("slow", function () {

        // will fade out the whole DIV that covers the website.
        $("#preloader").delay(300).fadeOut("slow");

      });
    });
  };


  /* Menu on Scrolldown
 * ------------------------------------------------------ */
  var ssMenuOnScrolldown = function () {

    var menuTrigger = $('#header-menu-trigger');

    $WIN.on('scroll', function () {

      if ($WIN.scrollTop() > 150) {
        menuTrigger.addClass('opaque');
      }
      else {
        menuTrigger.removeClass('opaque');
      }

    });
  };


  /* OffCanvas Menu
 * ------------------------------------------------------ */
  var ssOffCanvas = function () {

    var toggleButton = $('.menu-toggle'),
      nav = $('.main-navigation'),
      siteBody = $('body'),
      menuTrigger = $('#header-menu-trigger');


    // toggle button
    toggleButton.on('click', function (e) {

      e.preventDefault();
      toggleButton.toggleClass('is-clicked');
      nav.slideToggle();
      menuTrigger.toggleClass('opaquetop');

    });

    // nav items
    nav.find('li a').on("click", function () {

      // update the toggle button 		
      toggleButton.toggleClass('is-clicked');

      menuTrigger.toggleClass('opaquetop');

      // fadeout the navigation panel
      nav.fadeOut();

    });

    // close menu clicking outside the menu itself
    siteBody.on('click', function (e) {
      if (!$(e.target).is('.main-navigation, .menu-toggle, #menu-nav-wrap, #header-menu-trigger, #header-menu-trigger span')) {

        // update the toggle button 		
        toggleButton.removeClass('is-clicked');
        menuTrigger.removeClass('opaquetop')
        nav.slideUp();

      }

    });

  };
  /*---------------------------------------------------- */
  /* Highlight the current section in the navigation bar
  ------------------------------------------------------ */
  var ssHighlite = function () {
    var sections = $("section"),
      navigation_links = $("#main-nav-wrap li a");

    sections.waypoint({

      handler: function (direction) {

        var active_section;

        active_section = $('section#' + this.element.id);

        if (direction === "up") active_section = active_section.prev();

        var active_link = $('#main-nav-wrap a[href="#' + active_section.attr("id") + '"]');

        navigation_links.parent().removeClass("current");
        active_link.parent().addClass("current");

      },

      offset: '25%'
    });
  };
  /* Smooth Scrolling
	* ------------------------------------------------------ */
  var ssSmoothScroll = function () {

    $('.smoothscroll').on('click', function (e) {
      var target = this.hash,
        $target = $(target);

      e.preventDefault();
      e.stopPropagation();

      $('html, body').stop().animate({
        'scrollTop': $target.offset().top
      }, cfg.scrollDuration, 'swing').promise().done(function () {

        // check if menu is open
        if ($('body').hasClass('menu-is-open')) {
          $('#header-menu-trigger').trigger('click');
        }

        window.location.hash = target;
      });
    });

  };


  /* Placeholder Plugin Settings
	* ------------------------------------------------------ */
  var ssPlaceholder = function () {
    $('input, textarea, select').placeholder();
  };


  /* Alert Boxes
  ------------------------------------------------------- */
  var ssAlertBoxes = function () {

    $('.alert-box').on('click', '.close', function () {
      $(this).parent().fadeOut(500);
    });

  };


  /* Animations
	* ------------------------------------------------------- */
  var ssAnimations = function () {

    if (!$("html").hasClass('no-cssanimations')) {
      $('.animate-this').waypoint({
        handler: function (direction) {

          var defAnimationEfx = cfg.defAnimation;

          if (direction === 'down' && !$(this.element).hasClass('animated')) {
            $(this.element).addClass('item-animate');

            setTimeout(function () {
              $('body .animate-this.item-animate').each(function (ctr) {
                var el = $(this),
                  animationEfx = el.data('animate') || null;

                if (!animationEfx) {
                  animationEfx = defAnimationEfx;
                }

                setTimeout(function () {
                  el.addClass(animationEfx + ' animated');
                  el.removeClass('item-animate');
                }, ctr * 30);

              });
            }, 100);
          }

          // trigger once only
          this.destroy();
        },
        offset: '95%'
      });
    }

  };


  /* Intro Animation
	* ------------------------------------------------------- */
  var ssIntroAnimation = function () {

    $WIN.on('load', function () {

      if (!$("html").hasClass('no-cssanimations')) {
        setTimeout(function () {
          $('.animate-intro').each(function (ctr) {
            var el = $(this),
              animationEfx = el.data('animate') || null;

            if (!animationEfx) {
              animationEfx = cfg.defAnimation;
            }

            setTimeout(function () {
              el.addClass(animationEfx + ' animated');
            }, ctr * 300);
          });
        }, 100);
      }
    });

  };


  /* Contact Form
   * ------------------------------------------------------ */
  var ssContactForm = function () {

    /* local validation */
    $('#contactForm').validate({

      /* submit via ajax */
      submitHandler: function (form) {
        var sLoader = $('#submit-loader');

        $.ajax({
          type: "POST",
          url: "inc/sendEmail.php",
          data: $(form).serialize(),

          beforeSend: function () {
            sLoader.fadeIn();
          },
          success: function (msg) {
            // Message was sent
            if (msg == 'OK') {
              sLoader.fadeOut();
              $('#message-warning').hide();
              $('#contactForm').fadeOut();
              $('#message-success').fadeIn();
            }
            // There was an error
            else {
              sLoader.fadeOut();
              $('#message-warning').html(msg);
              $('#message-warning').fadeIn();
            }
          },
          error: function () {
            sLoader.fadeOut();
            $('#message-warning').html("Something went wrong. Please try again.");
            $('#message-warning').fadeIn();
          }
        });
      }

    });
  };


  /* AjaxChimp
	* ------------------------------------------------------ */
  var ssAjaxChimp = function () {

    $('#mc-form').ajaxChimp({
      language: 'uz',
      url: cfg.mailChimpURL
    });

    // Mailchimp translation
    //
    //  Defaults:
    //	 'submit': 'Submitting...',
    //  0: 'We have sent you a confirmation email',
    //  1: 'Please enter a value',
    //  2: 'An email address must contain a single @',
    //  3: 'The domain portion of the email address is invalid (the portion after the @: )',
    //  4: 'The username portion of the email address is invalid (the portion before the @: )',
    //  5: 'This email address looks fake or invalid. Please enter a real email address'

    $.ajaxChimp.translations.uz = {
      'submit': 'Yuborilmoqda...',
      0: '<i class="fa fa-check"></i> Sizga tasdiqlov xabari yuborildi.',
      1: '<i class="fa fa-warning"></i> To‘g‘ri manzilni kiriting.',
      2: '<i class="fa fa-warning"></i> To‘g‘ri manzil emas.',
      3: '<i class="fa fa-warning"></i> To‘g‘ri manzil emas.',
      4: '<i class="fa fa-warning"></i> To‘g‘ri manzil emas.',
      5: '<i class="fa fa-warning"></i> To‘g‘ri manzil emas.'
    }

  };




  /* Initialize
	* ------------------------------------------------------ */
  (function ssInit() {

    ssPreloader();
    ssMenuOnScrolldown();
    ssHighlite();
    ssOffCanvas();
    ssSmoothScroll();
    ssPlaceholder();
    ssAlertBoxes();
    ssAnimations();
    ssIntroAnimation();
    ssContactForm();
    ssAjaxChimp();

  })();


})(jQuery);