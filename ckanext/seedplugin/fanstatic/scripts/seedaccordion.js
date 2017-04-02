function check_toggle_all_btn() {
    var ul_datasets = $('.seed-accordion');
    if ($(ul_datasets).hasClass('expanded-all')) {
        $(ul_datasets).removeClass('expanded-all').addClass('collapsed-all');
        $('.seed-datasets-toggle-all').removeClass('btn-collapse-all').addClass('btn-expand-all').text('Collapse all');
    } else {
        $(ul_datasets).removeClass('collapsed-all').addClass('expanded-all');
        $('.seed-datasets-toggle-all').removeClass('btn-expand-all').addClass('btn-collapse-all').text('Expand all');
    }
}

function toogle_all_datasets(action) {
    var datasets = $('.seed-dataset');
    var resources = $('.seed-dataset-resource');
    for (var i = 0; i<datasets.length; i++) {
        if (action == 'collapse') {
            $(datasets[i]).removeClass('in');
            $(resources[i]).removeClass('in');
        } else if (action == 'expand') {
            if (!$(datasets[i]).hasClass('in')) {
                $(datasets[i]).addClass('in');
                $(resources[i]).addClass('in');
            }
        }
    }
}

function toogle_dataset(action, index, elem) {
    var dataset = $('.seed-dataset' + index);
    var resource = $('.seed-dataset-resource' + index);
    // console.log(dataset, resource);
    // console.log(action);
    // console.log(elem);
    if (action == 'collapse') {
        $(dataset).removeClass('in');
        $(elem).removeClass('a-expand').addClass('a-collapse');
    } else if (action == 'expand') {
        if (!$(dataset).hasClass('in')) {
            $(dataset).addClass('in');
            $(elem).removeClass('a-collapse').addClass('a-expand');
        }
    }
}

jQuery(document).ready(function () {
    var btn_toogle_all = $('.seed-datasets-toggle-all');
    check_toggle_all_btn();
    // $(btn_toogle_all).on('click', function(event) {
    //     if ($(btn_toogle_all).hasClass('btn-expand-all')) {
    //         toogle_all_datasets('collapse')
    //     } else if ($(btn_toogle_all).hasClass('btn-collapse-all')) {
    //         toogle_all_datasets('expand')
    //     }
    //     check_toggle_all_btn();
    // });
    $('.seed-dataset-accordion-btn a.btn').on('click', function(event) {
        var index = $(this).data('index');
        // console.log(index);
        // console.log(this);
        var action = $(this).hasClass('a-expand') ? 'collapse' : 'expand';
        // toogle_dataset(action, index, this);
    });
});
