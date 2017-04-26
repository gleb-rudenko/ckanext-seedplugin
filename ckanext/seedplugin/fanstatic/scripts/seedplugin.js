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
      $('.seed-selections-box').css('right', '0');
      var paths = $('.view-map-checkbox:checked').map(function () {
        if($(this).data('link') != '') {
          return $(this).data('link');
        };
      }).get();
      if (paths.length > 0) {
        n_datasets_wom = paths.filter(String).length
        paths = paths.join('');
        paths = paths.substring(1);
        main_link = 'https://geo.seed.nsw.gov.au/EDP_Public_Viewer/Index.html?viewer=EDP_Public_Viewer&run=ViewMap&url='
        main_link = main_link + paths;
        $('.seed-view-on-map-all').removeClass('seed-disabled');
        $('.seed-view-on-map-all').attr('href', main_link);
        $('.seed-view-on-map-count').append('<span title="Number of datasets with View on Map url."> ('+ n_datasets_wom +')</span>')
      }
      else {
        if(!$('.seed-view-on-map-all').hasClass('seed-disabled')){
          $('.seed-view-on-map-all').removeAttr('href');
          $('.seed-view-on-map-all').addClass('seed-disabled');
        }
      }
      var titles = $('.view-map-checkbox:checked').map(function () {
        return $(this);
      }).get();
      $('.seed-selected-datasets-list').empty();
      $.each(titles, function( index, value ) {
        $('.seed-selected-datasets-list').append("<li>" + value.data('title') + "<a class='seed-remove-selected-item' data-name="+ value.data('name') +" title='Remove dataset from selection'><span class='icon-remove-sign'></span></a></li>");
      });

    }
    else {
      $('.seed-view-on-map-all').removeAttr('href');
      $('.seed-view-on-map-all').addClass('seed-disabled');
      $('.seed-view-on-map-options').hide();
      $('.seed-selections-box').css('right', '129px');
      $(".all-datasets-checkbox").removeClass('dataset-plus').removeClass('checked_minus').addClass('datasets-not-checked');
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
      $('.seed-selections-box').css('right', '129px');
    }
    else {
      $( ".view-map-checkbox:checked" ).prop('checked', true);
      var inputs = $( ".view-map-checkbox:checked" );
      var n = inputs.length;
      $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
      countChecked();
    }
  });

  $("body").on("click", ".seed-remove-selected-item", function() {
    if ($("body").find("[data-name='" + $(this).data('name') + "']").length > 0) {
      $("body").find("[data-name='" + $(this).data('name') + "']").prop('checked', false);
      countChecked();
    }
  });

  $('body').on('click','.seed-selected-datasets-list', function(e){
    e.stopPropagation();
  });


  $('body').on('change','#select_lga', function(event){
    populateFormats($(event.target).val());
  });

  function populateFormats(lganame) {
    $.ajax({
        url: "http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Administrative_Boundaries/MapServer/1/query?where=lganame=%27"+lganame+"%27&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=lganame&returnGeometry=true&outSR=4326&returnDistinctValues=false&f=pjson",
        error: function (error) {
            console.log(error);
        },
        dataType: 'json',
        success: function (data) {
            var features = data.features;
            var queryStr_bbox = "";
            if (features[0]) {
                var polygonJson = features[0].geometry;

                xmax = polygonJson['rings'][0].reduce(function(max, arr) {
                    return max >= arr[0] ? max : arr[0];
                });
                ymax = polygonJson['rings'][0].reduce(function(max, arr) {
                    return max >= arr[1] ? max : arr[1];
                });
                xmin = polygonJson['rings'][0].reduce(function(min, arr) {
                    return min <= arr[0] ? min : arr[0];
                });
                ymin = polygonJson['rings'][0].reduce(function(min, arr) {
                    return min <= arr[1] ? min : arr[1];
                });
                var bbox_Str = xmin + "," + ymin + "," + xmax + "," + ymax;
                queryStr_bbox = bbox_Str;
            }
            $('#seed_ext_bbox').val(queryStr_bbox);
        },
        type: 'GET'
    });
  }

});

$(document).ready(function () {
  jQuery('.seed-filters-collapsing').children().each(function(index, el) {
    if(jQuery(this).find('li').hasClass('active')) {
      jQuery(this).find('h2').removeClass('collapsed');
      jQuery(this).find('ul').addClass('in')
    }
  });

  populateLGANames();
  function populateLGANames() {
    $.ajax({
        url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Administrative_Boundaries/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=lganame&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json',

        error: function (error) {

            console.log(error);
        },
        dataType: 'json',
        success: function (data) {
            var features = data.features;
            var lgaNames = [];

            for (index in features) {
                lgaNames.push(features[index].attributes.lganame);

            }
            lgaNames.sort(function (a, b) {
                return a.localeCompare(b, 'en', { 'sensitivity': 'base' });
            });

            for (index in lgaNames) {
                var url_lag = String(window.location.search);
                var lga_name = lgaNames[index].split(' ').join('+');
                if (url_lag.indexOf(lga_name) != -1) {
                  $('#select_lga').append('<option value="' + lgaNames[index] + '" aria-label="' + lgaNames[index] + '" selected="selected">' + lgaNames[index] + '</option>');
                }
                else {
                  $('#select_lga').append('<option value="' + lgaNames[index] + '" aria-label="' + lgaNames[index] + '" >' + lgaNames[index] + '</option>');
                };
            }
        },
        type: 'GET'
    });
  }

});
