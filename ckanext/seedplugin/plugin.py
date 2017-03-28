import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
import authenticator
from ckanext.seedplugin.logic.validators import (
    get_validators
)
from ckanext.seedplugin.helpers import (
    get_helpers
)
import ckan.lib.formatters as formatters
from ckan.common import _, ungettext
import datetime
import pytz


def seed_localised_nice_date(datetime_, show_date=False, with_hours=False):
    ''' Returns a friendly localised unicode representation of a datetime.

    :param datetime_: The date to format
    :type datetime_: datetime
    :param show_date: Show date not 2 days ago etc
    :type show_date: bool
    :param with_hours: should the `hours:mins` be shown for dates
    :type with_hours: bool

    :rtype: sting
    '''

    def months_between(date1, date2):
        if date1 > date2:
            date1, date2 = date2, date1
        m1 = date1.year * 12 + date1.month
        m2 = date2.year * 12 + date2.month
        months = m2 - m1
        if date1.day > date2.day:
            months -= 1
        elif date1.day == date2.day:
            seconds1 = date1.hour * 3600 + date1.minute + date1.second
            seconds2 = date2.hour * 3600 + date2.minute + date2.second
            if seconds1 > seconds2:
                months -= 1
        return months

    if not show_date:
        now = datetime.datetime.utcnow()
        if datetime_.tzinfo is not None:
            now = now.replace(tzinfo=datetime_.tzinfo)
        else:
            now = now.replace(tzinfo=pytz.utc)
            datetime_ = datetime_.replace(tzinfo=pytz.utc)
        date_diff = now - datetime_
        days = date_diff.days
        if days < 1 and now > datetime_:
            # less than one day
            seconds = date_diff.seconds
            if seconds < 3600:
                # less than one hour
                if seconds < 60:
                    return _('Just now')
                else:
                    return ungettext('{mins} minute ago', '{mins} minutes ago',
                                     seconds / 60).format(mins=seconds / 60)
            else:
                return ungettext('{hours} hour ago', '{hours} hours ago',
                                 seconds / 3600).format(hours=seconds / 3600)
        # more than one day
        months = months_between(datetime_, now)

        if months < 1:
            return ungettext('{days} day ago', '{days} days ago',
                             days).format(days=days)
        if months < 13:
            return ungettext('{months} month ago', '{months} months ago',
                             months).format(months=months)
        return ungettext('over {years} year ago', 'over {years} years ago',
                         months / 12).format(years=months / 12)


#handle singular numbers in date and month
    def day_i(day):
        if day > 9:
            return str(day)
        else:
            return '0'+str(day)

    def month_i(month):
        if month > 9:
            return str(month)
        else:
            return '0'+str(month)


    # actual date
    details = {
        'min': datetime_.minute,
        'hour': datetime_.hour,
        'day': datetime_.day,
        # we render day as "01,02,-31"
        'day_n': day_i(datetime_.day),
        'year': datetime_.year,
        'month': formatters._MONTH_FUNCTIONS[datetime_.month - 1](),
        #we render month as its atual number
        'month_n': month_i(datetime_.month),
        'timezone': datetime_.tzinfo.zone,
    }

    if with_hours:
        return (
            # NOTE: This is for translating dates like `April 24, 2013, 10:45 (Europe/Zurich)`
            #_('{month} {day}, {year}, {hour:02}:{min:02} ({timezone})') \
            _('{day_n}/{month_n}/{year}, {hour:02}:{min:02} ({timezone})') \
            .format(**details))
    else:
        return (
            # NOTE: This is for translating dates like `April 24, 2013`
            #_('{month} {day}, {year}').format(**details))
            # We reformatted date to dd/mm/yyyy
            _('{day_n}/{month_n}/{year}').format(**details))

formatters.localised_nice_date = seed_localised_nice_date


class SeedpluginPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IRoutes, inherit=True)
    plugins.implements(plugins.IValidators)
    plugins.implements(plugins.ITemplateHelpers)

    def __init__(self, **kwargs):
        authenticator.intercept_authenticator()

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_public_directory(config_, 'fanstatic')
        toolkit.add_resource('fanstatic', 'ckanext-seedplugin')
        toolkit.add_resource('fanstatic', 'seedplugin')

    def before_map(self, routeMap):
        """ Use our custom controller, and disable some unwanted URLs
        """
        controller = 'ckanext.seedplugin.controller:SEEDController'
        routeMap.connect('/user/logged_in', controller=controller, action='logged_in')
        routeMap.connect('/user/edit/{id:.*}', controller='ckanext.seedplugin.controller:SEEDUserController', action='edit')
        routeMap.connect('/user/_logout', controller='ckanext.seedplugin.controller:SEEDUserController', action='logout')
        routeMap.connect('/user/{id:.*}', controller='ckanext.seedplugin.controller:SEEDUserController', action='read')

        # block unwanted content
        #routeMap.connect('/user', controller='error', action='404')
        #routeMap.connect('/user/register', controller='error', action='404')
        #routeMap.connect('/user/followers/{username:.*}', controller='error', action='404')
        #routeMap.connect('/api/action/follow{action:.*}', controller='error', action='404')
        return routeMap

    # IValidators

    def get_validators(self):

        return get_validators()

    # ITemplateHelpers

    def get_helpers(self):

        return get_helpers()
