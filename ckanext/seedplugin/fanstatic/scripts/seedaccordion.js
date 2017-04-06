function check_toggle_all_btn() {
    var ul_datasets = $('.seed-accordion');
    if ($(ul_datasets).hasClass('expanded-all')) {
        $(ul_datasets).removeClass('expanded-all').addClass('collapsed-all');
        $('.seed-datasets-toggle-all').removeClass('btn-collapse-all').addClass('btn-expand-all').text('Collapse all');
    } else {
        $(ul_datasets).removeClass('collapsed-all').addClass('expanded-all');
        $('.seed-datasets-toggle-all').removeClass('bt n-expand-all').addClass('btn-collapse-all').text('Expand all');
    }
}

function change_expand_collapse_btns(index) {
    var dataset = $('.seed-dataset' + index);
    var resource = $('.seed-dataset-resource' + index);
    console.log(dataset, resource);
    if ($(dataset).hasClass('in')) {
        $('.seed-datasets-collapse-checked').attr('disabled', false);
    }
}

function toogle_all_datasets() {
    var datasets = $('.seed-dataset');
    var resources = $('.seed-dataset-resource');
    for (var i = 0; i<datasets.length; i++) {
        if ($(datasets[i]).hasClass('in')) {
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
    console.log(dataset, resource);
    console.log(elem);
    if (action == 'collapse') {
        $(dataset).collapse('hide');
        $(resource).collapse('hide');
        $(elem).addClass('a-collapse');
        $(elem).find('span').text('Expand');
    } else if (action == 'expand') {
        $(dataset).collapse('show');
        $(resource).collapse('show');
        $(elem).removeClass('a-collapse');
        $(elem).find('span').text('Collapse');
    }
}

jQuery(document).ready(function () {
    $('.all-datasets-checkbox').on('click', function(event) {
        console.log('click checkbox');
        var checkboxes = $('.checkbox-dataset input[type=checkbox]');
        if ($(this).hasClass('datasets-not-checked')) {
            for (var i = 0; i < checkboxes.length; i++) {
                $(checkboxes[i]).prop('checked', true);
            }
            $('.all-datasets-checkbox').removeClass('datasets-not-checked');
        } else {
            for (var i = 0; i < checkboxes.length; i++) {
                $(checkboxes[i]).prop('checked', false);
                $('.all-datasets-checkbox').addClass('datasets-not-checked');
                $('.seed-datasets-expand-checked').attr('disabled', true);
                $('.seed-datasets-collapse-checked').attr('disabled', true);
            }
            if ($('.all-datasets-checkbox').prop('checked')) {
                $('.all-datasets-checkbox').prop('checked', false);
                $('.all-datasets-checkbox').removeClass('checked_minus');
            }
        }

    });
    $('.checkbox-dataset input[type=checkbox]').on('click', function(event) {
        console.log($(this));
        console.log('all checkbox = ', $('.checkbox-dataset input[type=checkbox]').length);
        console.log('checked checkbox = ', $('.checkbox-dataset input[type=checkbox]:checked').length);

        var state_checked = $(this).prop('checked');
        var datasets_checkbox_checked = $('.checkbox-dataset input[type=checkbox]:checked').length;
        var datasets_checkbox = $('.checkbox-dataset input[type=checkbox]').length;
        if (state_checked) {
            $('.all-datasets-checkbox').removeClass('datasets-not-checked');
            if (datasets_checkbox_checked != datasets_checkbox) {
                $('.all-datasets-checkbox').addClass('checked_minus');
                $('.all-datasets-checkbox').prop('checked', true);
            } else if (datasets_checkbox_checked == datasets_checkbox) {
                $('.all-datasets-checkbox').removeClass('checked_minus');
            }
        } else {
            if ($('.checkbox-dataset input[type=checkbox]:checked').length == 0) {
                $('.all-datasets-checkbox').addClass('datasets-not-checked');
                if ($('.all-datasets-checkbox').prop('checked')) {
                    $('.all-datasets-checkbox').prop('checked', false);
                }
                $('.all-datasets-checkbox').removeClass('checked_minus');
                $('.seed-datasets-expand-checked').attr('disabled', true);
                $('.seed-datasets-collapse-checked').attr('disabled', true);
            }
        }
        var index = $(this).val();
        console.log(index);
        change_expand_collapse_btns(index);
        // if ($(btn_toogle_all).hasClass('btn-expand-all')) {
        //     toogle_all_datasets('collapse')
        // } else if ($(btn_toogle_all).hasClass('btn-collapse-all')) {
        //     toogle_all_datasets('expand')
        // }
        check_toggle_all_btn();
    });
    $('.seed-dataset-accordion-btn a.a-expand').on('click', function(event) {
        console.log('this = ', this);
        console.log('event.target = ', event.target);
        var action = $(this).hasClass('a-collapse') ? 'expand' : 'collapse';
        var index = $(this).data('index');
        console.log(action, index);
        toogle_dataset(action, index, this);
    });
});
