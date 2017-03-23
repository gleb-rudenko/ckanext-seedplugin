import re
import ckan.lib.base
from ckan.lib.base import BaseController, c, render, request
from ckan.controllers.user import UserController
from ckan.model import Session
from ckanext.seedplugin.common.authenticator import SEEDUser

from logging import getLogger
LOG = getLogger(__name__)

class SEEDController(BaseController):

    def logged_in(self):
        controller = UserController()
        if not c.user:
            # a number of failed login attempts greater than 10
            # indicates that the locked user is associated with the current request
            seedUser = Session.query(SEEDUser).filter(SEEDUser.login_attempts > 10).first()
            if seedUser:
                seedUser.login_attempts = 10
                Session.commit()
                return controller.login('account-locked')
        return controller.logged_in()
