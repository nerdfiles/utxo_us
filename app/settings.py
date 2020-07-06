#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
from tempfile import mkdtemp

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
_ = lambda s: s
gettext = lambda s: s

FILE_UPLOAD_TEMP_DIR=mkdtemp()

SECRET_KEY = '2jkA5+XdJal+FQb/V7p0sNUFB0w='
DEBUG = True
TEMPLATE_DEBUG = DEBUG
DEBUG404 = True
DEBUGSMS = True
DEBUGBLOCKSCORE = True

SITE_ID = 1

ALLOWED_HOSTS = [
    'local.utxo.us',
    'utxo.us',
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INTERNAL_IPS = ('127.0.0.1',)

INSTALLED_APPS = (
    "sslserver",
    'django.contrib.sites',
    'flat',
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'django_jenkins',

    'django.contrib.sitemaps',
    'djangocms_page_sitemap',

    'django_extensions',
    'compressor',
    'nested_admin',
    #'google_analytics',

    'cms',                     # django CMS itself
    'treebeard',               # utilities for implementing a tree
    'menus',                   # helper for model independent hierarchical website navigation
    'sekizai',                 # for javascript and css management
    'djangocms_admin_style',   # for the admin skin. You **must** add 'djangocms_admin_style' in the list **before** 'django.contrib.admin'.
    'django.contrib.messages', # to enable messages framework (see :ref:`Enable messages <enable-messages>`)

    'filer',
    'parler',

    'meta',
    'meta_mixin',
    'easy_thumbnails',

    'taggit',
    'taggit_autosuggest',

    'djangocms_page_meta',
    'admin_enhancer',

    'rest_framework',
    'djangular',
    'debug_toolbar',
    'djangocms_restapi'

)

#AUTH_USER_MODEL = 'app.UserProfile'
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_JQUERY_URL = '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'

INSTALLED_APPS += (
    'django_seo_js',
    'ckeditor',
    'ckeditor_uploader',
)

INSTALLED_APPS += (
    'djangocms_file',
    'djangocms_flash',
    'djangocms_googlemap',
    'djangocms_inherit',
    'djangocms_picture',
    'djangocms_teaser',
    'djangocms_video',
    'djangocms_link',
    'djangocms_snippet',
    'djangocms_text_ckeditor',
    'cmsplugin_filer_file',
    'cmsplugin_filer_folder',
    'cmsplugin_filer_link',
    'cmsplugin_filer_image',
    'cmsplugin_filer_teaser',
    'cmsplugin_filer_video',
    'app',
)

AJAX_CRAWLING_URLCONF = 'app.urls_ajax_crawling'

MIDDLEWARE_CLASSES = (
    'django.middleware.cache.UpdateCacheMiddleware',

    #'sslify.middleware.SSLifyMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'django.middleware.doc.XViewMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    "django.middleware.cache.FetchFromCacheMiddleware",
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware',
    'app.request_cache.RequestCacheMiddleware',
    'django_ajax_crawling.middleware.HtmlSnapshotMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

SECURE_BROWSER_XSS_FILTER = False
SECURE_CONTENT_TYPE_NOSNIFF = False
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_SECONDS = 0
SECURE_REDIRECT_EXEMPT = []
if DEBUG is True:
    SECURE_SSL_HOST = 'localhost'
else:
    SECURE_SSL_HOST = None
SECURE_SSL_REDIRECT = False

LOGIN_REDIRECT_URL = '/dashboard/'
LOGIN_URL = '/'

MIDDLEWARE_CLASSES = (
    'django_seo_js.middleware.EscapedFragmentMiddleware',  # If you're using #!
    'django_seo_js.middleware.UserAgentMiddleware',  # If you want to detect by user agent
) + MIDDLEWARE_CLASSES

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

SEO_JS_PRERENDER_TOKEN = "123456789abcdefghijkl"  # Really, put this in your env, not your codebase.

#TEMPLATE_CONTEXT_PROCESSORS = (
    #'django.contrib.auth.context_processors.auth',
    #'django.contrib.messages.context_processors.messages',
    #'django.core.context_processors.i18n',
    #'django.core.context_processors.request',
    #'django.core.context_processors.media',
    #'django.core.context_processors.static',
    #'sekizai.context_processors.sekizai',
    #'cms.context_processors.cms_settings',
#)

#print 'TEMPLATES BASE_DIR'
#print BASE_DIR

DJANGO_WYSIWYG_FLAVOR = 'ckeditor'

CKEDITOR_SETTINGS = {
    'toolbar_Config': [
        {'name': 'document', 'items': ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
        {'name': 'clipboard', 'items': ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
        {'name': 'editing', 'items': ['Find', 'Replace', '-', 'SelectAll']},
        {'name': 'forms', 'items': ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField']},
        '/',
        {'name': 'basicstyles', 'items': ['cmsplugins', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']},
        {'name': 'paragraph', 'items': ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']},
        {'name': 'links', 'items': ['Link', 'Unlink', 'Anchor']},
        {'name': 'insert', 'items': ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']},
        '/',
        {'name': 'styles', 'items': ['Styles', 'Format', 'Font', 'FontSize']},
        {'name': 'colors', 'items': ['TextColor', 'BGColor']},
        {'name': 'tools', 'items': ['Maximize', 'ShowBlocks']},
    ],
    'toolbar': 'Config'
}

TEXT_SAVE_IMAGE_FUNCTION = 'djangocms_text_ckeditor.picture_save.create_picture_plugin'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, "app", "views"),
            os.path.join(BASE_DIR, "app", "templates", "utxo"),
            os.path.join(BASE_DIR, "app", "templates"),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.request',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                'app.context_processors.date_formats',
                'app.context_processors.site_info',
                'sekizai.context_processors.sekizai',
                'cms.context_processors.cms_settings',
            ],
        },
    },
]

CMS_PERMISSION = True
CMS_PAGE_CACHE = True
CMS_PLACEHOLDER_CACHE = True
CMS_PLUGIN_CACHE = False
CMS_TOOLBAR_SIMPLE_STRUCTURE_MODE = False

#CMS_PLACEHOLDER_CONF = {
    #'content': {
        #'name': _('Content'),
        #'plugins': ['TextPlugin'],
    #},
#}

#CMS_TOOLBARS = [
    #'cms.cms_toolbar.PlaceholderToolbar',
    #'cms.cms_toolbar.BasicToolbar',
    #'cms.cms_toolbar.PageToolbar'
#]

CMS_TEMPLATES = (
    ('home.html', 'UTXO / Home'),
    ('about.html', 'UTXO / About'),
    ('contact.html', 'UTXO / Contact'),
    ('legal.html', 'UTXO / Legal'),
)

LANGUAGE_CODE='en'

LANGUAGES = (
    ('en', gettext('English')),
    ('fr', gettext('French')),
    ('it', gettext('Italiano')),
)

CMS_LANGUAGES = {
    1: [
        {
            'code': 'en',
            'name': gettext('English'),
            'public': True,
        },
        {
            'code': 'it',
            'name': gettext('Italiano'),
            'public': True,
        },
        {
            'code': 'fr',
            'name': gettext('French'),
            'public': True,
        },
    ],
    2: [
        {
            'code': 'en',
            'name': gettext('English'),
            'public': True,
        },
    ],
    'default': {
        'hide_untranslated': False,
    },
}

GOOGLE_MAPS_SERVER_KEY = 'AIzaSyBsVi6P-ZL79wHG3r05f-F48Dsg-KX_Tag'

#MIGRATION_MODULES = {
    ##'djangocms_file': 'djangocms_file.migrations_django',
    ##'djangocms_flash': 'djangocms_flash.migrations_django',
    ##'djangocms_googlemap': 'djangocms_googlemap.migrations_django',
    ##'djangocms_inherit': 'djangocms_inherit.migrations_django',
    ##'djangocms_link': 'djangocms_link.migrations_django',
    ##'djangocms_picture': 'djangocms_picture.migrations_django',
    ##'djangocms_snippet': 'djangocms_snippet.migrations_django',
    ##'djangocms_teaser': 'djangocms_teaser.migrations_django',
    ##'djangocms_video': 'djangocms_video.migrations_django',
    ##'djangocms_text_ckeditor': 'djangocms_text_ckeditor.migrations_django',
    #'cmsplugin_filer_file': 'cmsplugin_filer_file.migrations_django',
    #'cmsplugin_filer_folder': 'cmsplugin_filer_folder.migrations_django',
    #'cmsplugin_filer_link': 'cmsplugin_filer_link.migrations_django',
    #'cmsplugin_filer_image': 'cmsplugin_filer_image.migrations_django',
    #'cmsplugin_filer_teaser': 'cmsplugin_filer_teaser.migrations_django',
    #'cmsplugin_filer_video': 'cmsplugin_filer_video.migrations_django',
#}

META_SITE_PROTOCOL = 'http'
import platform
if platform.node() is 'Somato':
    META_SITE_DOMAIN = 'local.utxo.us'
else:
    META_SITE_DOMAIN = 'utxo.us'

META_USE_OG_PROPERTIES = True
META_USE_TWITTER_PROPERTIES = True
META_USE_GOOGLEPLUS_PROPERTIES = True
THUMBNAIL_PROCESSORS = (
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    'filer.thumbnail_processors.scale_and_crop_with_subject_location',
    'easy_thumbnails.processors.filters',
)
ROOT_URLCONF = 'app.urls'

PARLER_LANGUAGES = {
    1: (
        {'code': 'en'},
        {'code': 'it'},
        {'code': 'fr'},
    ),
    2: (
        {'code': 'en'},
    ),
    'default': {
        'fallback': 'en',
        'hide_untranslated': False,
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
        #'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
        #'rest_framework.permissions.DjangoModelPermissions',
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    )
}
REST_FRAMEWORK_EXTENSIONS = {
    'DEFAULT_CACHE_RESPONSE_TIMEOUT': 60 * 15
}

WSGI_APPLICATION = 'app.wsgi.application'

TIME_ZONE = 'America/Chicago'

USE_I18N = True
USE_L10N = False
USE_TZ = True

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

from imp import find_module
STATICFILES_DIRS = (
    ('', os.path.join(os.path.abspath(find_module("cms")[1]), 'static')),
    os.path.join(BASE_DIR, 'app', 'scripts'),
    os.path.join(BASE_DIR, 'app', 'styles'),
    os.path.join(BASE_DIR, 'app', 'views'),
    os.path.join(BASE_DIR, 'app', 'partials')
)

CMS_MEDIA_ROOT=os.path.join(STATIC_ROOT, "cms/")
CMS_MEDIA_URL = "/static/cms/"

MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

ADMIN_MEDIA_PREFIX = STATIC_URL + 'admin/'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.BCryptPasswordHasher',
)

AXES_LOGIN_FAILURE_LIMIT = 10
AXES_USE_USER_AGENT = True
AXES_COOLOFF_TIME = 1
AXES_LOCKOUT_TEMPLATE = '403.html'

DEBUG_TOOLBAR_PATCH_SETTINGS = False
DEBUG_TOOLBAR_CONFIG = {'INTERCEPT_REDIRECTS': False, }

def show_toolbar(request):
    return True

SHOW_TOOLBAR_CALLBACK = show_toolbar
# New syntax...
#DEBUG_TOOLBAR_CONFIG = {
    #"SHOW_TOOLBAR_CALLBACK" : show_toolbar,
#}

import sys
if 'test' in sys.argv:
    from app.test_settings import *  # pylint: disable=W0401,W0614
else:
    from app.local_settings import *  # pylint: disable=F0401,E0611


def get_setting(name):
    from django.conf import settings
    from meta_mixin import settings as meta_settings

    default = {
        'APP_IMAGE_THUMBNAIL_SIZE': getattr(settings, 'APP_IMAGE_THUMBNAIL_SIZE', {
            'size': '120x120',
            'crop': True,
            'upscale': False
        }),

        'APP_IMAGE_FULL_SIZE': getattr(settings, 'APP_IMAGE_FULL_SIZE', {
            'size': '640x120',
            'crop': True,
            'upscale': False
        }),

        'APP_TAGCLOUD_MIN': getattr(settings, 'APP_TAGCLOUD_MIN', 1),
        'APP_TAGCLOUD_MAX': getattr(settings, 'APP_TAGCLOUD_MAX', 10),
        'APP_PAGINATION': getattr(settings, 'APP_PAGINATION', 10),
        'APP_LATEST_TERMSAGREEMENTS': getattr(settings, 'APP_LATEST_TERMSAGREEMENTS', 5),
        'APP_TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT': getattr(settings,
                                                    'APP_TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT',
                                                    100),
        'APP_TYPE': getattr(settings, 'APP_TYPE', 'Article'),
        'APP_FB_TYPE': getattr(settings, 'APP_FB_TYPE', 'Article'),
        'APP_FB_APPID': getattr(settings, 'APP_FB_APPID',
                                 meta_settings.FB_APPID),
        'APP_FB_PROFILE_ID': getattr(settings, 'APP_FB_PROFILE_ID',
                                      meta_settings.FB_PROFILE_ID),
        'APP_FB_PUBLISHER': getattr(settings, 'APP_FB_PUBLISHER',
                                     meta_settings.FB_PUBLISHER),
        'APP_FB_AUTHOR_URL': getattr(settings, 'APP_FB_AUTHOR_URL',
                                      'get_author_url'),
        'APP_FB_AUTHOR': getattr(settings, 'APP_FB_AUTHOR',
                                  'get_author_name'),
        'APP_TWITTER_TYPE': getattr(settings, 'APP_TWITTER_TYPE', 'Summary'),
        'APP_TWITTER_SITE': getattr(settings, 'APP_TWITTER_SITE',
                                     meta_settings.TWITTER_SITE),
        'APP_TWITTER_AUTHOR': getattr(settings, 'APP_TWITTER_AUTHOR',
                                       'get_author_twitter'),
        'APP_GPLUS_TYPE': getattr(settings, 'APP_GPLUS_SCOPE_CATEGORY',
                                   'Blog'),
        'APP_GPLUS_AUTHOR': getattr(settings, 'APP_GPLUS_AUTHOR',
                                     'get_author_gplus'),
        'APP_ENABLE_COMMENTS': getattr(settings, 'APP_ENABLE_COMMENTS', True),
        'APP_USE_ABSTRACT': getattr(settings, 'APP_USE_ABSTRACT', True),
        'APP_USE_PLACEHOLDER': getattr(settings, 'APP_USE_PLACEHOLDER', True),
        'APP_MULTISITE': getattr(settings, 'APP_MULTISITE', True),
        'APP_AUTHOR_DEFAULT': getattr(settings, 'APP_AUTHOR_DEFAULT', True),
    }
    return default['APP_%s' % name]
