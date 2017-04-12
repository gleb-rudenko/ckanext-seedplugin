from ckan.common import c


def get_seed_helpers():
    return {
        'get_datasets_targets': get_datasets_targets
    }


def get_datasets_targets():

    data_targets_datasets = ','.join([
        '.seed-dataset' + str(counter)
        for counter in range(1, c.page.item_count + 1)])
    data_targets_resources = ','.join([
        '.seed-dataset-resource' + str(counter)
        for counter in range(1, c.page.item_count + 1)])
    data_targets = data_targets_datasets + ',' + data_targets_resources
    print 'data_targets123123 = {}'.format(c.data_targets)
    return data_targets
