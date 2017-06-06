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

    // sessionStorage functionality
    if (this === window && sessionStorage['all-checked'] == 'true') {
        $('#all-datasets-checkbox').prop('checked', true);
        $('#all-datasets-checkbox').removeClass('datasets-not-checked').addClass('dataset-plus');
        $('.view-map-checkbox').each(function(index, item) {
            $(item).prop('checked', true);
        });
    } else {
      var inStorage = false;

      if ($(this).hasClass('view-map-checkbox')) {
        if ($(this).prop('checked')) {
          sessionStorage.setItem(this.id, this.id);
        } else {
          sessionStorage.removeItem(this.id);
          if (sessionStorage['all-checked'] == 'true') {
            $('.view-map-checkbox').each(function(index, item) {
                $(item).prop('checked') && sessionStorage.setItem(item.id, item.id);
            });
          }
          sessionStorage['all-checked'] = false;
        }
      }

      if (this === window) {
        $('.view-map-checkbox').each(function(index, item) {
            if (sessionStorage[item.id]) {
              $(item).prop('checked', true);
              inStorage = true;
            }
        });
        inStorage && $('#all-datasets-checkbox').removeClass('datasets-not-checked').addClass('checked_minus');
      }
    }


    var inputs = $( ".view-map-checkbox:checked" );
    var map_datasets = $('.seed-view-on-map-datasets');
    var view_on_map = $('.seed-view-on-map-all');
    var expend_button =  $('.seed-datasets-expand-checked');
    var collapse_button =  $('.seed-datasets-collapse-checked');
    var n = inputs.length;

    $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
    if (n > 0) {
      $('.seed-view-on-map-count').css('opacity', '1');
      map_datasets.attr('href');
      map_datasets.attr('data-toggle', 'dropdown');
      map_datasets.removeClass('seed-disabled');
      map_datasets.attr('title', 'View selection list');
      // $('.seed-view-on-map-options').show();
      //if ($(window).width() < 979) {
          $('.seed-filter-title-mobile-desktop1199').addClass('seed-filter-title-mobile-320-979');
          $('.seed-selections-box').addClass('seed-selections-box-320-979');
    //   } else {
    //       $('.seed-filter-title-mobile-desktop1199').removeClass('seed-filter-title-mobile-320-979');
    //       $('.seed-selections-box').removeClass('seed-selections-box-320-979');
    //   }
      var map_service_id = $('.view-map-checkbox:checked').map(function () {
        if($(this).data('mapservice') != '') {
          return $(this).data('mapservice');
        };
      }).get();
      var layer_list_name = $('.view-map-checkbox:checked').map(function () {
        if($(this).data('listname') != '') {
          return $(this).data('listname');
        };
      }).get();
      var layer_catalog_name = $('.view-map-checkbox:checked').map(function () {
        if($(this).data('catalogname') != '') {
          return $(this).data('catalogname');
        };
      }).get();
      if (map_service_id.length > 0 && layer_list_name.length > 0 && layer_catalog_name.length > 0) {
        n_datasets_wom = map_service_id.filter(String).length
        var all_fields = [];
        var layer_list_name_all = []
        for (var i = 0; i < n_datasets_wom; i++) {
          all_fields.push([layer_catalog_name[i], map_service_id[i],layer_list_name[i]])
        }
        var cataloglayer = all_fields.map(function(item){
          return item.join('.');
        });
        cataloglayer = cataloglayer.join(',');
        for (var i = 0; i < n_datasets_wom; i++) {
          layer_list_name_all.push(layer_list_name[i])
        }
        layer_list_name_all = layer_list_name_all.join(',');
        main_link = 'http://geo.dev.edptest.info/EDP_DEV_Viewer/Index.html?viewer=EDP_DEV_Viewer&locale=en-AU&runWorkflow=AppendLayerCatalog&CatalogLayer=' + cataloglayer + '&MapServiceID=' + map_service_id[0] + '&LayerListName=' + layer_list_name_all;
        view_on_map.removeClass('seed-disabled');
        view_on_map.attr('href', main_link);
        view_on_map.attr('title', 'Show selected Dataset on Map');
        $('.seed-view-on-map-count').append('<span title="Number of datasets with View on Map url."> ('+ n_datasets_wom +')</span>')
        map_datasets.attr('href');
        map_datasets.attr('data-toggle', 'dropdown');
        map_datasets.removeClass('seed-disabled');
        map_datasets.attr('title', 'View selection list');
      }
      else {
        if(!$('.seed-view-on-map-all').hasClass('seed-disabled')){
          view_on_map.removeAttr('href').addClass('seed-disabled').attr('title', 'Select an item with View on Map to make available');
          map_datasets.removeAttr('href').removeAttr('data-toggle').addClass('seed-disabled').attr('title', 'Select to make available');
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
      view_on_map.removeAttr('href').addClass('seed-disabled').attr('title', 'Select an item with View on Map to make available');
      map_datasets.removeAttr('href').removeAttr('data-toggle').addClass('seed-disabled').attr('title', 'Select to make available');
      $('.seed-filter-title-mobile-desktop1199').removeClass('seed-filter-title-mobile-320-979');
      $('.seed-selections-box').removeClass('seed-selections-box-320-979');
    };

    if(expend_button.hasClass('seed-disable')){
      expend_button.attr('title', 'Select a collapsed item to make available');
    }
    else {
      expend_button.attr('title', 'Expand selection');
    };
    if(collapse_button.hasClass('seed-disable')){
      collapse_button.attr('title', 'Selected an expanded item to make available');
    }
    else {
      collapse_button.attr('title', 'Collapse selection');
    };

  };
  countChecked();

  $( ".view-map-checkbox" ).on( "click", countChecked );

  $('.all-datasets-checkbox ').on('change', function(){
    if(!$('#all-datasets-checkbox').prop('checked')) {
      sessionStorage.setItem('all-checked', false);
      $( "input[type='checkbox'].view-map-checkbox" ).prop('checked', false);
      var inputs = $( ".view-map-checkbox:checked" );
      var n = inputs.length;
      $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
      // $('.seed-view-on-map-options').hide();
      //if ($(window).width() < 979) {
      $('.seed-filter-title-mobile-desktop1199').removeClass('seed-filter-title-mobile-320-979');
      $('.seed-selections-box').removeClass('seed-selections-box-320-979');
       countChecked.call(this);
     //}
    }
    else {
      sessionStorage.clear();
      sessionStorage.setItem('all-checked', true);
      $( "input[type='checkbox'].view-map-checkbox" ).prop('checked', true);
      var inputs = $( ".view-map-checkbox:checked" );
      var n = inputs.length;
      $('.seed-view-on-map-count').text( n + ' datasets in selection').css('opacity', '0.6');
      countChecked.call(this);
    }
  });

  $("body").on("click", ".seed-remove-selected-item", function() {
    if ($("body").find("[data-name='" + $(this).data('name') + "']").length > 0) {
      $("body").find("[data-name='" + $(this).data('name') + "']").prop('checked', false);
      countChecked();
      $('.all-datasets-checkbox').removeClass('dataset-plus');
      $('.all-datasets-checkbox').addClass('checked_minus');
    }
    if ($('.checkbox-dataset input[type=checkbox]:checked').length == 0) {
      $('.all-datasets-checkbox').removeClass('dataset-plus');
      $('.all-datasets-checkbox').removeClass('checked_minus');

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
        beforeSend: function (jqXHR,settings) {
          $('.seed-loading-message').show();
        },
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
        type: 'GET',
        complete: function (jqXHR, textStatus) {
          if (textStatus == 'success') {
            $('.seed-loading-message').hide();
          };
        }
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
