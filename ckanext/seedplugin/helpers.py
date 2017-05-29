# encoding=utf-8

from ckan.common import c, request
from ckan.lib.helpers import Page
import ckan.logic as logic
from urlparse import urlparse, parse_qs
from urllib import urlencode


def get_seed_helpers():
    return {
        'get_datasets_targets': get_datasets_targets,
        'seed_facet_list': seed_facet_list,
        'seed_facet_remove': seed_facet_remove,
        'seed_all_facets_remove': seed_all_facets_remove,
        'visualise_on_map_has_web_map_layer': has_web_map_layer,
        'visualise_on_map_get_web_map_layer_url': get_web_map_layer_url
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


def seed_facet_remove(items, name):
    result = {'got_active': False}
    url = request.url
    full_path = urlparse(url)
    query_items = parse_qs(full_path.query)
    for idx, i in enumerate(items):
        if i['active'] is True and name in query_items:
            result['got_active'] = True
            query_items.pop(name)

    unparse_q_items = urlencode(query_items, doseq=True)
    result['domain'] = full_path.netloc
    result['path'] = full_path.path
    result['query'] = unparse_q_items

    return result


def seed_all_facets_remove(facets):
    result = {'got_active': False}
    url = request.url
    full_path = urlparse(url)
    query_items = parse_qs(full_path.query)
    for facet in facets:
        if facet in query_items:
            result['got_active'] = True
            query_items.pop(facet)
    unparse_q_items = urlencode(query_items, doseq=True)
    result['domain'] = full_path.netloc
    result['path'] = full_path.path
    result['query'] = unparse_q_items
    return result


def seed_pagination(self, *args, **kwargs):
    # Overriting CKAN default pagination method to SEED's custom method
    kwargs.update(
        format=u"<div class='pagination pagination-centered'><ul>"
        "$link_first $link_previous ~2~ $link_next $link_last</ul></div>",
        symbol_previous=u'‹', symbol_next=u'›',
        symbol_first=u'«', symbol_last=u'»',
        curpage_attr={'class': 'active'}, link_attr={}
    )

    return super(Page, self).pager(*args, **kwargs)

Page.pager = seed_pagination


def has_web_map_layer(package_dict):
    '''Returns a boolean indicating whether the dataset has a layer in Geocortex'''
    if package_dict['resources'] is not None:
        for resource in package_dict['resources']:
            strFormat = resource['format'].lower().replace(' ', '')
            if strFormat == 'edpwebmap' or strFormat == 'seedwebmap':
                return True
    else:
        return False


def get_web_map_layer_url(package_dict):
    '''Returns the URL to show the dataset's layer on Geocortex.'''
    if package_dict['resources'] is not None:
        for resource in package_dict['resources']:
            strFormat = resource['format'].lower().replace(' ', '')
            if strFormat == 'edpwebmap' or strFormat == 'seedwebmap':
                return resource['url']
    else:
        return ''
