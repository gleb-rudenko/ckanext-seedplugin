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
    $('<label class="datepicker-button" for="ext_startdate"><i class="icon-th" style="position: relative;"></i></label>').insertAfter($("#ext_startdate"));
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
    $('<label class="datepicker-button" for="ext_enddate"><i class="icon-th" style="position: relative;"></i></label>').insertAfter($("#ext_enddate"));
    if($('#ext_enddate_after').length > 0){
      remove_date = String(window.location.href);
      date = jQuery('#ext_enddate_after').text().trim();
      $('#ext_enddate_after a').attr('href', remove_date.replace(date, ''))
    };
} );
