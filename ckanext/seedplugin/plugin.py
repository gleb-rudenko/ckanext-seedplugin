import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
import authenticator
from ckanext.seedplugin.logic.validators import (
    get_validators
)
import ckanext.seedplugin.helpers as seed_helpers
import ckan.lib.formatters as formatters
from ckan.common import _, ungettext, request
import datetime
import pytz
import pylons.config as config
import logging
import ckan.lib.helpers as h
import ckan.model as model


log = logging.getLogger(__name__)
var = []


def user_list(context, data_dict):
    user = context['user']
    if user:
        return {'success': True}
    else:
        h.redirect_to('/user/login')


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


# handle singular numbers in date and month
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
        # we render month as its atual number
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
    plugins.implements(plugins.IFacets)
    plugins.implements(plugins.IAuthenticator, inherit=True)
    plugins.implements(plugins.IAuthFunctions, inherit=True)
    plugins.implements(plugins.IResourceController, inherit=True)
    plugins.implements(plugins.ITemplateHelpers)
    plugins.implements(plugins.IPackageController, inherit=True)

    def __init__(self, **kwargs):
        authenticator.intercept_authenticator()

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_public_directory(config_, 'theme/public')
        toolkit.add_resource('fanstatic', 'seedplugin')

    def before_map(self, routeMap):
        """ Use our custom controller, and disable some unwanted URLs
        """
        controller = 'ckanext.seedplugin.controller:SEEDController'
        controllerUser = 'ckanext.seedplugin.controller:SEEDUserController'
        # controllerPackage = 'ckanext.seedplugin.controller:SEEDPackageController'

        routeMap.redirect('/user/register', config.get('ckan.site_url'))

        routeMap.connect('/user/logged_in', controller=controller,
                         action='logged_in')
        routeMap.connect('/user/login', controller='user', action='login')
        routeMap.connect('/user/register', controller='user',
                         action='register')
        routeMap.connect('/user/logged_out', controller='user',
                         action='logged_out')
        routeMap.connect('/user/logged_out_redirect', controller='user',
                         action='logged_out_page')
        routeMap.connect('/user/me', controller='user', action='me')
        routeMap.connect('/user/reset', controller='user',
                         action='request_reset')
        routeMap.connect('/user/_logout', controller=controllerUser,
                         action='logout')
        routeMap.connect('/user/edit/{id:.*}', controller=controllerUser,
                         action='edit')
        routeMap.connect('/user/{id:.*}', controller=controllerUser,
                         action='read')
        routeMap.connect('/download_results', controller=controller,
                         action='download_results')
        # routeMap.connect('/dataset', controller=controllerPackage,
        #                  action='search', highlight_actions='index search')

        return routeMap

    # ITemplateHelpers

    def get_helpers(self):
        return seed_helpers.get_seed_helpers()

    # IValidators

    def get_validators(self):

        return get_validators()

    # IFacets
    def dataset_facets(self, facets_dict, package_type):
        # We will actually remove all the core facets and add our own
        facets_dict.clear()
        facets_dict['topic'] = toolkit._('Topic Category')
        facets_dict['tags'] = toolkit._('Tags')
        facets_dict['organization'] = toolkit._('Organisation')
        facets_dict['res_format'] = toolkit._('Formats')
        return facets_dict

    def organization_facets(self, facets_dict, organization_type,
                            package_type):
        facets_dict.clear()
        facets_dict['topic'] = toolkit._('Topic Category')
        facets_dict['tags'] = toolkit._('Tags')
        facets_dict['organization'] = toolkit._('Organisation')
        facets_dict['res_format'] = toolkit._('Formats')
        return facets_dict

    # IAuthenticator
    def login(self):
        pass

    def identify(self):
        log.debug(request.environ['CKAN_CURRENT_URL'].split('?'))
        if request.environ['CKAN_CURRENT_URL'].split('?')[0] == '/user/logged_in':
            if var:
                log.debug("var has value once logged in, clearing var")
                del var[:]
                return var
            else:
                pass
        if hasattr(toolkit.c.userobj, 'password'):
            upassword = getattr(toolkit.c.userobj, 'password')
            if var:
                log.debug('existing var')
                log.debug(var)
                if upassword == var[0]:
                    log.debug("same, pass")
                    # log.debug(upassword)
                    pass
                else:
                    var[0] = upassword
                    log.debug("different, do stuff")
                    # this toolkit redirect does not do what user expects)
                    toolkit.redirect_to(controller='user', action='logout', __ckan_no_root=True, id=None)
                    # h.redirect_to('http://ckan.dev.edptest.info/user/logout')
                    # to do - this logs the user out, but does not redirect user to the "you have been logged out" page.
                    # return render('user/logout.html')
            else:
                log.debug("var is appended")
                var.append(upassword)
        else:
            pass

    def logout(self):
        pass

    # IAuthfunctions
    def get_auth_functions(self):
        return {'user_list': user_list}

    # IResource controller - dynamic urls for resources with Seed web map
    def before_show(self, resource_dict):
        pkg = model.Package.get(resource_dict['package_id'])
        seedwebmap = 'SEED Web Map'
        if resource_dict['format'].lower() == seedwebmap.lower() and 'map_type' in pkg.extras:
            resource_dict['url'] = 'https://geo.seed.nsw.gov.au/EDP_Public_Viewer/Index.html?viewer=EDP_Public_Viewer&run=ViewMap&url='+pkg.extras['map_type']+":map_service_id="+pkg.extras['map_service_id'].replace("&","+")+";layer_id="+pkg.extras['layer_id'].replace("&","+")
        return resource_dict

    def before_search(self, search_params):
        print search_params
        extras = search_params.get('extras')
        if not extras:
            return search_params

        start_date = extras.get('ext_startdate', '')
        end_date = extras.get('ext_enddate', '')

        fq = search_params['fq']
        if start_date and not end_date:
            fq = '{fq} +created:[{start_date} TO *]'.format(
                fq=fq, start_date=start_date)
        if end_date and not start_date:
            fq = '{fq} +created:[* TO {end_date}]'.format(
                fq=fq, end_date=end_date)
        if start_date and end_date:
            fq = '{fq} +created:[{start_date}  TO {end_date}]'.format(
                fq=fq, start_date=start_date, end_date=end_date)

        search_params['fq'] = fq

        return search_params
