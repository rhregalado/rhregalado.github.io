// By Chris Johnson
// http://chrisltd.com
// Created October 2013
// Version .04
// Run this plugin on a div properly set with src data and captions and it will create a fading slideshow inside a div with an id of 'slideshow'

(function( $ ){

  $.fn.YoFadingSlideshow = function( options ) {

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'childObject'             : 'div',            // Target object
      'slideshowTarget'         : '',               // Object to create the slideshow inside of
      'shouldAutoAdvance'       : true,             // Should the slideshow auto advance
      'autoAdvanceDelay'        : 3000,             // How much time in milliseconds between slides
      'startAutoAdvanceDelay'   : 3000,             // How much time in milliseconds before auto-advancing starts
      'includeNextPrevious'     : true,             // Display next and previous buttons
      'includePills'            : true,             // Display pills navigation
      'includeCaptions'         : true,             // Display captions
      'pauseOnHover'            : false,            // Pause auto advance on hover
      'fadeSpeed'               : 200,              // Speed of fade in miliseconds
      'captionAnimationSpeed'   : 200,              // Value for caption animations
      'nextText'                : '',               // Text inside of the next link
      'previousText'            : '',               // Text inside of the previous link
      'preloadNextImage'        : true,             // Preload possible next image into hidden div
      'touchEnabled'            : false,            // enabled the ability to swipe back and forth for navigation, jQuery mobile required
      'randomizeSlides'         : false,            // randomize the order of the slides
      'initCallback'            : function() {},    // Called if plugin initialized on an object
      'beforeSlid'              : function() {},    // Called before the image has changed
      'afterSlid'               : function() {}     // Called after the image has changed
    }, options);

    // Plugin code 

    var el = this;
    var $dataObject = $(this);
    var $slideshowTarget = $(settings.slideshowTarget);
    var slideData = new Array();
    var nextPrevious = '';
    var pills = '';
    var caption = '';
    var currentSlide = 0;
    var autoAdvanceTimer = null;
    var initialAutoAdvanceTimer = null;
    var delayBetweenSlideActions = settings.fadeSpeed + 100; // a little bit extra for safety
    if( settings.includeCaptions ){
      delayBetweenSlideActions += settings.captionAnimationSpeed;
    }

    // Find and make sure there are child objects and a slideshow target before continuing
    var childTotal = $("> " + settings.childObject, this).length;
    var slideshowTargetTotal = $slideshowTarget.length;
    if( childTotal < 1 || slideshowTargetTotal < 1 ){
      console.log("Missing data object children or slideshow target");
      return;
    }

    // Hide data object
    $dataObject.hide();

    // Pull data from child objects
    $("> " + settings.childObject, this).each(function(index, value) {
      var $child = $(this);
      var imgData = new Array();
      imgData['src'] = $child.data("src");
      imgData['caption'] = $child.html();
      slideData.push( imgData );
    });

    // Randomize slide order
    if( settings.randomizeSlides ){
      slideData.sort(function(){
        return 0.5 - Math.random();
      });
    }

    // Create slideshow markup
    if( settings.includeNextPrevious && childTotal > 1 ){
      nextPrevious = '<a href="#" class="previous">' + settings.previousText + '</a>' + '<a href="#" class="next">' + settings.nextText + '</a>';
    }

    if( settings.includePills && childTotal > 1 ){
      pills = '<div class="pills">';
      for(var i = 0; i < slideData.length; i++){
        pills += '<a href="#" data-slide-target="'+ i + '" class="pill';
        if( i === 0){
          pills+= ' active';
        }
        pills += '"></a>';
      }
      pills += '</div>';
    }

    if( settings.includeCaptions){
      caption = '<div class="caption col6 center pad">'
                  + '<div class="caption_border">'
                  + '<div class="caption_inner">'
                  + slideData[0]['caption']
                  + '</div>'
                  + '</div>'
                  + '</div>';
    }

    $slideshowTarget.prepend(
      '<div class="preload_target" style="width: 0; height: 0; position: absolute;"></div>' 
      + '<div class="slide"></div>' // bottom slide (initially obscured)
      + '<div class="slide" style="background-image: url(' + slideData[0]['src'] + ' );"></div>'
      + nextPrevious
      + pills
      + caption
    );

    // If there is only one slide, let's stop here
    if( childTotal == 1 ){
      // console.log("Only one slide detected.");
      settings.initCallback();
      return;
    }

    preloadNextSlide();

    // Bind actions to buttons
    $('.pill', $slideshowTarget).on('click', function(event) {
      event.preventDefault();
      $this = $(this);
      var slideNum = $this.data('slide-target');
      goToSlide( slideNum );
    });

    $('.next', $slideshowTarget).on('click', function(event) {
      event.preventDefault();
      nextSlide();
    });

    $('.previous', $slideshowTarget).on('click', function(event) {
      event.preventDefault();
      previousSlide();
    });

    if( settings.pauseOnHover ){
      $slideshowTarget
        .mouseover(function() {
          stopAutoAdvance();
        })
        .mouseout(function() {
          startAutoAdvance();
        });
    }

    // Bind touch events
    if( settings.touchEnabled ){
      $slideshowTarget.on( "swipeleft", nextSlide );
      $slideshowTarget.on( "swiperight", previousSlide );
    }

    // Auto advance
    function autoAdvance(){
      nextSlide();
    }

    function startAutoAdvance(){
      if( settings.shouldAutoAdvance ){
        autoAdvanceTimer = setInterval( autoAdvance, settings.autoAdvanceDelay );
      }
    }

    function stopAutoAdvance(){
      if( typeof autoAdvanceTimer !== "undefined" ){
        clearInterval( autoAdvanceTimer );
      }
      if( typeof initialAutoAdvanceTimer !== "undefined" ){
        clearTimeout( initialAutoAdvanceTimer );
      }
    }

    // Start autoadvance after a delay
    var initialAutoAdvanceTimer = window.setTimeout( startAutoAdvance, settings.startAutoAdvanceDelay );

    // Functions
    function goToSlide( i ){
      settings.beforeSlid();
      stopAutoAdvance(); // stop auto advancing temporarily
      var $nextSlide = $('.slide', $slideshowTarget).first();
      var $activeSlide = $('.slide', $slideshowTarget).last();
      $nextSlide.stop(true, true);
      $activeSlide.stop(true, true);
      currentSlide = i;
      $nextSlide.css('backgroundImage', 'url(' + slideData[ i ]['src'] + ')');
      $activeSlide.fadeOut( settings.fadeSpeed, function(){
        $activeSlide.prependTo( settings.slideshowTarget );
        $activeSlide.show();
        preloadNextSlide();
      });
      updateActivePill();
      updateCaption();
      startAutoAdvance();
      settings.afterSlid();
    }

    function preloadNextSlide(){
      if( !settings.preloadNextImage ){
        return;
      }
      var $preloadTarget = $('.preload_target', $slideshowTarget);
      $preloadTarget.css('backgroundImage', 'url(' + slideData[ getNextSlideIndex() ]['src'] + ')');
    }

    function getNextSlideIndex(){
      var nextSlide = currentSlide + 1;
      if( nextSlide >= slideData.length ){
        nextSlide = 0;
      }
      return nextSlide;
    }

    function getPreviousSlideIndex(){
      var previousSlide = currentSlide - 1;
      if( currentSlide === 0 ){
        previousSlide = slideData.length - 1;
      }
      return previousSlide;
    }

    function nextSlide(){
      goToSlide( getNextSlideIndex() );
    }

    function previousSlide(){
      goToSlide( getPreviousSlideIndex() );
    }

    function updateActivePill(){
      $('.pill', $slideshowTarget).removeClass('active');
      $('.pill:nth-child(' + (currentSlide + 1) + ')', $slideshowTarget).addClass('active');
    }

    function updateCaption(){
      var $captionTarget = $('.caption_inner', $slideshowTarget);
      var currentHeight = $captionTarget.outerHeight(true);
      $captionTarget.stop(true, true);
      $captionTarget.css({'min-height': currentHeight + "px", 'max-height': currentHeight + "px"});
      $captionTarget.animate(
        { opacity: 0.0 },
        settings.captionAnimationSpeed,
        function() {
        $captionTarget.html( slideData[ currentSlide ]['caption'] );
        }
      ).animate(
        {"min-height": 0, "max-height" : "1000px" },
        settings.captionAnimationSpeed
      ).animate(
        { opacity: 1 },
        settings.captionAnimationSpeed
      );
    }

    this.destroySlideshow = function(){
      // console.log('removing slideshow');
      $dataObject.remove();
      $slideshowTarget.remove();
      stopAutoAdvance();
    }

    // Initialized
    settings.initCallback();

    return this;

  };
})( jQuery );
