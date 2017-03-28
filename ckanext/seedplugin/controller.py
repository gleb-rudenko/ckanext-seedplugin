import ckan.lib.base as base
from ckan.lib.base import BaseController, c, render, request
from ckan.controllers.user import UserController
from ckan.model import Session
from ckanext.seedplugin.authenticator import SEEDUser
import ckan.logic as logic
import ckan.lib.authenticator as authenticator
import ckan.lib.helpers as h
from ckan.common import _
import ckan.lib.navl.dictization_functions as dictization_functions
import ckan.plugins as p
import ckan.model as model
from pylons import config

from logging import getLogger
log = getLogger(__name__)

abort = base.abort

check_access = logic.check_access
get_action = logic.get_action
NotFound = logic.NotFound
NotAuthorized = logic.NotAuthorized
ValidationError = logic.ValidationError
UsernamePasswordError = logic.UsernamePasswordError

DataError = dictization_functions.DataError
unflatten = dictization_functions.unflatten


class SEEDController(BaseController):

    def logged_in(self):
        #log.debug("insde-------------------")
        controller = UserController()
        if not c.user:
            # a number of failed login attempts greater than 10
            # indicates that the locked user is associated with the current request
            seedUser = Session.query(SEEDUser).filter(SEEDUser.login_attempts > 5).first()
            if seedUser:
                seedUser.login_attempts = 5
                Session.commit()
                return controller.login('Login Failed: Bad username or password')
        return controller.logged_in()


class SEEDUserController(UserController):

    def read(self, id=None):
        context = {'model': model, 'session': model.Session,
                   'user': c.user or c.author, 'auth_user_obj': c.userobj,
                   'for_view': True}
        data_dict = {'id': id,
                     'user_obj': c.userobj,
                     'include_datasets': True,
                     'include_num_followers': True}

        context['with_related'] = True

        try:
            #check_access('user_show', context, data_dict)
            check_access('user_list', context, data_dict)
        except NotAuthorized:
            abort(401, _('Not authorized to see this page'))

        self._setup_template_variables(context, data_dict)

        # The legacy templates have the user's activity stream on the user
        # profile page, new templates do not.
        if h.asbool(config.get('ckan.legacy_templates', False)):
            c.user_activity_stream = get_action('user_activity_list_html')(
                context, {'id': c.user_dict['id']})

        return render('user/read.html')

    def edit(self, id=None, data=None, errors=None, error_summary=None):
        return super(SEEDUserController, self).edit(id, data, errors, error_summary)

    def _save_edit(self, id, context):
        try:
            data_dict = logic.clean_dict(unflatten(
                logic.tuplize_dict(logic.parse_params(request.params))))
            context['message'] = data_dict.get('log_message', '')
            data_dict['id'] = id

            if data_dict['password1'] and data_dict['password2']:
                identity = {'login': c.user,
                            'password': data_dict['old_password']}
                auth = authenticator.UsernamePasswordAuthenticator()

                if auth.authenticate(request.environ, identity) != c.user:
                    raise UsernamePasswordError

            #Is there a better place to do this?
            if 'activity_streams_email_notifications' not in data_dict:
                data_dict['activity_streams_email_notifications'] = False

            user = get_action('user_update')(context, data_dict)
            h.flash_success(_('Profile updated'))
            #h.redirect_to(controller='user', action='read', id=user['name'])

            #if the updated profile has been saved successfully, we check if user has entered a password. if yes, password has been changed, logout current user
            if data_dict['password1']:
                h.redirect_to(controller='user', action='logout', __ckan_no_root=True)
            #if not, redirect to user/<username> page
            h.redirect_to(controller='user', action='read', id=user['name'])

        except NotAuthorized:
            abort(401, _('Unauthorized to edit user %s') % id)
        except NotFound, e:
            abort(404, _('User not found'))
        except DataError:
            abort(400, _(u'Integrity Error'))
        except ValidationError, e:
            errors = e.error_dict
            error_summary = e.error_summary
            return self.edit(id, data_dict, errors, error_summary)
        except UsernamePasswordError:
            errors = {'oldpassword': [_('Password entered was incorrect')]}
            error_summary = {_('Old Password'): _('incorrect password')}
            return self.edit(id, data_dict, errors, error_summary)

    def logout(self):
        # Do any plugin logout stuff
        for item in p.PluginImplementations(p.IAuthenticator):
            item.logout()
        url = h.url_for(controller='user', action='logged_out_page',
                        __ckan_no_root=True)
        h.redirect_to(self._get_repoze_handler('logout_handler_path') +
                      '?came_from=' + url)

        #log.debug('session '+session)
        #session.invalidate()
        #session.clear()
        #log.debug('session '+session)
        #session.clear()
