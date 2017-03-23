import re
import ckan.lib.base
from ckan.lib.base import BaseController, c, render, request
from ckan.controllers.user import UserController
from ckan.model import Session
from ckanext.seedplugin.authenticator import SEEDUser

from logging import getLogger
log = getLogger(__name__)

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
