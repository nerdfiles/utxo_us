# -*- coding: utf-8 -*-
from copy import deepcopy

from cms.admin.placeholderadmin import FrontendEditableAdminMixin, PlaceholderAdminMixin
from django import forms
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import get_user_model
from parler.admin import TranslatableAdmin

from .models import AppCategory, Terms
from .settings import get_setting

try:
    from admin_enhancer.admin import EnhancedModelAdminMixin
except ImportError:
    class EnhancedModelAdminMixin(object):
        pass


class AppCategoryAdmin(EnhancedModelAdminMixin, TranslatableAdmin):

    def get_prepopulated_fields(self, request, obj=None):
        return {'slug': ('name',)}

    class Media:
        css = {
            'all': ('%s%s' % (settings.STATIC_URL,
                              'app_admin.css'),)
        }


class TermsAdmin(EnhancedModelAdminMixin, FrontendEditableAdminMixin,
                 PlaceholderAdminMixin, TranslatableAdmin):
    list_display = ['title', 'author', 'date_published', 'date_published_end']
    date_hierarchy = 'date_published'
    raw_id_fields = ['author']
    frontend_editable_fields = ('title', 'abstract', 'terms_text')
    available_fields = ['title', 'slug']
    enhance_exclude = ('main_image', 'tags')
    _fieldsets = [
        (None, {
            'fields': [
                ('title', 'categories', 'publish')]}), ('Info', {
            'fields': (
                [
                    'slug', 'tags'], ('date_published', 'date_published_end', 'enable_comments')), 'classes': (
                'collapse',)}), ('Images', {
            'fields': (
                ('main_image', 'main_image_thumbnail', 'main_image_full'),), 'classes': (
                'collapse',)}), ('SEO', {
            'fields': [
                ('meta_description', 'meta_title', 'meta_keywords')], 'classes': (
                'collapse',)}), ]

    def formfield_for_dbfield(self, db_field, **kwargs):
        field = super(
            TermsAdmin,
            self).formfield_for_dbfield(
            db_field,
            **kwargs)
        if db_field.name == 'meta_description':
            original_attrs = field.widget.attrs
            original_attrs['maxlength'] = 160
            field.widget = forms.TextInput(original_attrs)
        elif db_field.name == 'meta_title':
            field.max_length = 70
        return field

    def get_fieldsets(self, request, obj=None):
        fsets = deepcopy(self._fieldsets)
        if get_setting('USE_ABSTRACT'):
            fsets[0][1]['fields'].append('abstract')
        if not get_setting('USE_PLACEHOLDER'):
            fsets[0][1]['fields'].append('terms_text')
        if get_setting('MULTISITE'):
            fsets[1][1]['fields'][0].append('sites')
        if request.user.is_superuser:
            fsets[1][1]['fields'][0].append('author')
        return fsets

    def get_prepopulated_fields(self, request, obj=None):
        return {'slug': ('title',)}

    def save_model(self, request, obj, form, change):
        if not obj.author and get_setting('AUTHOR_DEFAULT'):
            if get_setting('AUTHOR_DEFAULT') is True:
                user = request.user
            else:
                user = get_user_model().objects.get(
                    username=get_setting('AUTHOR_DEFAULT'))
            obj.author = user
        super(TermsAdmin, self).save_model(request, obj, form, change)

    class Media:
        css = {
            'all': ('%s%s' % (settings.STATIC_URL,
                              'app_admin.css'),)
        }


admin.site.register(AppCategory, AppCategoryAdmin)
admin.site.register(Terms, TermsAdmin)
