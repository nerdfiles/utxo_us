# -*- coding: utf-8 -*-
from cms.models.pluginmodel import CMSPlugin
from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from django.utils.translation import ugettext_lazy as _

from .forms import LatestEntriesForm
from .models import AuthorEntriesPlugin, AppCategory, LatestTermsPlugin, Terms
from .settings import get_setting


class AppPlugin(CMSPluginBase):
    module = 'App'


class AppLatestEntriesPlugin(AppPlugin):
    """
    Non cached plugin which returns the latest terms agreements taking into account the
      user / toolbar state
    """
    render_template = 'plugins/latest_entries.html'
    name = _('Latest App Articles')
    model = LatestTermsPlugin
    form = LatestEntriesForm
    filter_horizontal = ('categories',)
    fields = ('latest_termsagreements', 'tags', 'categories')
    cache = False

    def render(self, context, instance, placeholder):
        context = super(AppLatestEntriesPlugin, self).render(context, instance, placeholder)
        context['latest_termsagreements_list'] = instance.get_latest_termsagreements(context['request'])
        context['TRUNCWORDS_COUNT'] = get_setting('TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT')
        return context


class AppLatestEntriesPluginCached(AppPlugin):
    """
    Cached plugin which returns the latest published terms agreements
    """
    render_template = 'plugins/latest_entries.html'
    name = _('Latest App Articles')
    model = LatestTermsPlugin
    form = LatestEntriesForm
    filter_horizontal = ('categories',)
    fields = ('latest_termsagreements', 'tags', 'categories')

    def render(self, context, instance, placeholder):
        context = super(AppLatestEntriesPluginCached, self).render(context, instance, placeholder)
        context['latest_termsagreements_list'] = instance.get_latest_termsagreements()
        context['TRUNCWORDS_COUNT'] = get_setting('TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT')
        return context


class AppAuthorTermsPlugin(AppPlugin):
    module = _('App')
    name = _('Author App Articles')
    model = AuthorEntriesPlugin
    form = LatestEntriesForm
    render_template = 'plugins/authors.html'
    filter_horizontal = ['authors']

    def render(self, context, instance, placeholder):
        context = super(AppAuthorTermsPlugin, self).render(context, instance, placeholder)
        context['authors_list'] = instance.get_authors()
        return context


class AppTagsPlugin(AppPlugin):
    module = _('App')
    name = _('Tags')
    model = CMSPlugin
    render_template = 'plugins/tags.html'

    def render(self, context, instance, placeholder):
        context = super(AppTagsPlugin, self).render(context, instance, placeholder)
        context['tags'] = Terms.objects.tag_cloud(queryset=Terms.objects.published())
        return context


class AppCategoryPlugin(AppPlugin):
    module = _('App')
    name = _('Categories')
    model = CMSPlugin
    render_template = 'plugins/categories.html'

    def render(self, context, instance, placeholder):
        context = super(AppCategoryPlugin, self).render(context, instance, placeholder)
        context['categories'] = AppCategory.objects.all()
        return context


class AppArchivePlugin(AppPlugin):
    module = _('App')
    name = _('Archive')
    model = CMSPlugin
    render_template = 'plugins/archive.html'

    def render(self, context, instance, placeholder):
        context = super(AppArchivePlugin, self).render(context, instance, placeholder)
        context['dates'] = Terms.objects.get_months(queryset=Terms.objects.published())
        return context


plugin_pool.register_plugin(AppLatestEntriesPlugin)
plugin_pool.register_plugin(AppAuthorTermsPlugin)
plugin_pool.register_plugin(AppTagsPlugin)
plugin_pool.register_plugin(AppArchivePlugin)
plugin_pool.register_plugin(AppCategoryPlugin)
