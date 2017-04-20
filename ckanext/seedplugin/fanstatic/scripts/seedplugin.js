jQuery(window).scroll(function(){
  var account = jQuery('.account-masthead').height();
  var banner = jQuery('.navbar-static-top').height();
  var sticky = jQuery('.sticky'),
      scroll = jQuery(window).scrollTop();

  if (scroll >= (account + banner)) sticky.addClass('sticky-scrolled');
  else sticky.removeClass('sticky-scrolled');
});

$( function() {
    $( "#ext_startdate" ).datepicker({
      dateFormat: "yy-mm-dd",
      showOtherMonths: true,
      selectOtherMonths: true
    });
    $('<label class="datepicker-button" for="ext_startdate"><i class="fa fa-th" style="position: relative;"></i></label>').insertAfter($("#ext_startdate"));
    if($('#ext_startdate_after').length > 0){
      remove_date = String(window.location.href);
      date = jQuery('#ext_startdate_after').text().trim();
      $('#ext_startdate_after a').attr('href', remove_date.replace(date, ''))
    };

    $( "#ext_enddate" ).datepicker({
      dateFormat: "yy-mm-dd",
      showOtherMonths: true,
      selectOtherMonths: true
    });
    $('<label class="datepicker-button" for="ext_enddate"><i class="fa fa-th" style="position: relative;"></i></label>').insertAfter($("#ext_enddate"));
    if($('#ext_enddate_after').length > 0){
      remove_date = String(window.location.href);
      date = jQuery('#ext_enddate_after').text().trim();
      $('#ext_enddate_after a').attr('href', remove_date.replace(date, ''))
    };

  var countChecked = function() {
    var inputs = $( ".view-map-checkbox:checked" );
    var n = inputs.length;
    $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
    if (n > 0) {
      $('.seed-view-on-map-count').css('opacity', '1');
    };
    if (n > 0) {
      $('.seed-view-on-map-options').show();
      if ($('.view-map-checkbox:checked').data('link').length > 0) {
        var paths = $('.view-map-checkbox:checked').map(function () {
          return $(this).data('link');
        }).get();
        paths = paths.join('');
        paths = paths.substring(1);
        main_link = 'https://geo.seed.nsw.gov.au/EDP_Public_Viewer/Index.html?viewer=EDP_Public_Viewer&run=ViewMap&url='
        main_link = main_link + paths;
        $('.seed-view-on-map-all').attr('href', main_link);
      };

      var titles = $('.view-map-checkbox:checked').map(function () {
        return $(this).data('title');
      }).get();
      $('.seed-selected-datasets-list').empty();
      $.each(titles, function( index, value ) {
        $('.seed-selected-datasets-list').append("<li>" + value + "</li>");
      });

    }
    else {
      $('.seed-view-on-map-options').hide();
    };

  };
  countChecked();

  $( ".view-map-checkbox" ).on( "click", countChecked );

  $('.all-datasets-checkbox ').on('change', function(){
    if($('.all-datasets-checkbox ').hasClass('datasets-not-checked')){
      $( ".view-map-checkbox:checked" ).prop('checked', false);
      var inputs = $( ".view-map-checkbox:checked" );
      var n = inputs.length;
      $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
      $('.seed-view-on-map-options').hide();
    }
    else {
      $( ".view-map-checkbox:checked" ).prop('checked', true);
      var inputs = $( ".view-map-checkbox:checked" );
      var n = inputs.length;
      $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
      if (n > 0) {
        $('.seed-view-on-map-count').css('opacity', '1');
        $('.seed-view-on-map-options').show();
      };
      var paths = $('.view-map-checkbox:checked').map(function () {
        return $(this).data('link');
      }).get();
      paths = paths.join('');
      paths = paths.substring(1);
      main_link = 'https://geo.seed.nsw.gov.au/EDP_Public_Viewer/Index.html?viewer=EDP_Public_Viewer&run=ViewMap&url='
      var titles = $('.view-map-checkbox:checked').map(function () {
        return $(this).data('title');
      }).get();
      main_link = main_link + paths;
      $('.seed-view-on-map-all').attr('href', main_link);
      $('.seed-selected-datasets-list').empty();
      $.each(titles, function( index, value ) {
        $('.seed-selected-datasets-list').append("<li>" + value + "</li>");
      });
    }
  });

} );


