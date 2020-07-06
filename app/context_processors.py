# -*- coding: utf-8 -*-

from django.conf import settings
from django.middleware.csrf import get_token


def date_formats(request):
    """
    date_formats
    """
    return {
        'date_format_long': 'l j F Y',
    }


def site_info(request):
    '''
    site_info
    '''
    import datetime
    dt = datetime
    today = dt.datetime.today()
    formatted_today = today.strftime("%d-%b-%Y")
    host = request.META.get('HTTP_HOST', '')

    site_url = 'http://%s' % host
    assets_url_base = '//%s' % host
    assets_url = settings.STATIC_URL

    if settings.DEBUG:
        assets_url = settings.MEDIA_URL

    return {
        'TODAY': formatted_today,
        'SITE_URL': site_url,
        'baseUrl': './#',
        'ASSETS_URL': assets_url_base + assets_url,
        #'STRIPE_PUBLIC_KEY': settings.STRIPE_PUBLIC_KEY
    }
