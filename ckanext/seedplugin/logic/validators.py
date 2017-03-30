import datetime
import ckan.lib.helpers as h
import ckan.lib.navl.dictization_functions as df
from ckan.common import _


Invalid = df.Invalid


def get_validators():
    return {
        'seed_isodate': seed_isodate,
    }


def seed_isodate(value, context):
    if isinstance(value, datetime.datetime):
        return value
    if value == '':
        return None
    try:
        date = h.date_str_to_datetime(value)
    except (TypeError, ValueError):
        raise Invalid(_('Date format incorrect. Date must be yyyy/mm/dd or\
                        yyyy-mm-dd11111111111'))
    return date
