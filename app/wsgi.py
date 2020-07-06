#! /usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import site
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
REMOTE_APP_PATH = '/home/django/sutton_spectre/app'
REMOTE_APP_PYTHON_PACKAGES = '/root/.envs/HOONM5gpFswaVA_utxo/lib/python2.7/site-packages'

if os.path.exists(REMOTE_APP_PATH):
    sys.path.append(REMOTE_APP_PATH)
if os.path.exists(REMOTE_APP_PYTHON_PACKAGES):
    site.addsitedir(REMOTE_APP_PYTHON_PACKAGES)

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
