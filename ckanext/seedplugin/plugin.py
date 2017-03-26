import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
#import ckanext.seedplugin.common
#from ckanext.seedplugin.common.controller import SEEDController
#from ckanext.seedplugin.common.controller import SEEDController as sEEDController
import authenticator
from ckanext.seedplugin.logic.validators import (
    get_validators
)


class SeedpluginPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IRoutes, inherit=True)
    plugins.implements(plugins.IValidators)

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

        # block unwanted content
        #routeMap.connect('/user', controller='error', action='404')
        #routeMap.connect('/user/register', controller='error', action='404')
        #routeMap.connect('/user/followers/{username:.*}', controller='error', action='404')
        #routeMap.connect('/api/action/follow{action:.*}', controller='error', action='404')
        return routeMap

    # IValidators

    def get_validators(self):

        return get_validators()
