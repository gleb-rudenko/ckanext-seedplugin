from ckan.common import c
import ckan.logic as logic


def get_seed_helpers():
    return {
        'get_datasets_targets': get_datasets_targets,
        'seed_facet_list': seed_facet_list
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


def seed_facet_list():
    facet_dict = []
    topic_facets = logic.get_action('package_search')({}, {'facet.field': '["topic"]'}).get('facets')
    res_format_facets = logic.get_action('package_search')({}, {'facet.field': '["res_format"]'}).get('facets')
    facet_dict.append(topic_facets)
    facet_dict.append(res_format_facets)
    return facet_dict
