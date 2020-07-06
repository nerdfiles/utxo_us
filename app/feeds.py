# -*- coding: utf-8 -*-
from django.contrib.sites.models import Site
from django.contrib.syndication.views import Feed
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext as _

from .models import Terms
from .settings import get_setting


class LatestEntriesFeed(Feed):

    def link(self):
        return reverse('app:termsagreements-latest')

    def title(self):
        return _('App terms agreements on %(site_name)s') % {'site_name': Site.objects.get_current().name}

    def items(self, obj=None):
        return Terms.objects.published().order_by('-date_published')[:10]

    def item_title(self, item):
        return item.safe_translation_getter('title')

    def item_description(self, item):
        if get_setting('USE_ABSTRACT'):
            return item.safe_translation_getter('abstract')
        return item.safe_translation_getter('post_text')


class TagFeed(LatestEntriesFeed):

    def get_object(self, request, tag):
        return tag  # pragma: no cover

    def items(self, obj=None):
        return Terms.objects.published().filter(tags__slug=obj)[:10]

