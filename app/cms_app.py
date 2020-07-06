# -*- coding: utf-8 -*-
from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import ugettext_lazy as _

from .menu import AppCategoryMenu


class AppApp(CMSApp):
    name = _('App')
    urls = ['app.urls']
    app_name = 'app'
    menus = [AppCategoryMenu]

apphook_pool.register(AppApp)
