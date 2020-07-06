# -*- coding: utf-8 -*-

"""
Models
"""
from cms.models import CMSPlugin, PlaceholderField
from django.conf import settings as dj_settings
from django.core.urlresolvers import reverse
from django.db import models
from django.utils import timezone
from django.utils.encoding import force_text, python_2_unicode_compatible
from django.utils.html import escape, strip_tags
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import get_language
from djangocms_text_ckeditor.fields import HTMLField
from filer.fields.image import FilerImageField
from meta_mixin.models import ModelMeta
from parler.managers import TranslationManager
from parler.models import TranslatableModel, TranslatedFields, TranslatedFieldsModel
from taggit_autosuggest.managers import TaggableManager

from .managers import GenericDateTaggedManager
from .settings import get_setting

APP_CURRENT_TERMS_IDENTIFIER = 'app_terms_current'

from django.contrib.auth.models import User


def profile_content(instance):
    return u'profile_content'


class UserProfile(models.Model):

    '''
    '''
    user = models.OneToOneField(User)
    profile_content = PlaceholderField(profile_content,
                                       null=True,
                                       blank=True,
                                       help_text='Content Plugin')

    def __unicode__(self):
        return self.user.username


class UserProfilePluginModel(CMSPlugin):

    '''
        UserProfile Plugin Model
    '''

    class Meta:
        app_label = 'app'

    def __unicode__(self):
        return self.user.username


@python_2_unicode_compatible
class AppCategory(TranslatableModel):

    """
    App category
    """
    parent = models.ForeignKey('self', verbose_name=_('parent'), null=True,
                               blank=True)
    date_created = models.DateTimeField(_('created at'), auto_now_add=True)
    date_modified = models.DateTimeField(_('modified at'), auto_now=True)

    translations = TranslatedFields(
        name=models.CharField(_('name'), max_length=255),
        slug=models.SlugField(_('slug'), blank=True, db_index=True),
        meta={'unique_together': [('slug', 'language_code', ),]}
    )

    objects = TranslationManager()

    class Meta:
        verbose_name = _('app category')
        verbose_name_plural = _('app categories')

    @property
    def count(self):
        print dir(self)
        return self.app_terms_categories.filter(publish=True).count()

    def get_absolute_url(self):
        lang = get_language()
        if self.has_translation(lang):
            slug = self.safe_translation_getter('slug', language_code=lang)
            return reverse(
                'app:termsagreements-category',
                kwargs={
                    'category': slug})
        # in case category doesn't exist in this language, gracefully fallback
        # to termsagreements-latest
        return reverse('app:termsagreements-latest')

    def __str__(self):
        return self.safe_translation_getter('name')

    def save(self, *args, **kwargs):
        super(AppCategory, self).save(*args, **kwargs)
        for lang in self.get_available_languages():
            self.set_current_language(lang)
            if not self.slug and self.name:
                self.slug = slugify(force_text(self.name))
        self.save_translations()


@python_2_unicode_compatible
class Terms(ModelMeta, TranslatableModel):

    """
    Terms Agreement Model
    """
    author = models.ForeignKey(dj_settings.AUTH_USER_MODEL,
                               verbose_name=_(u'author'), null=True, blank=True,
                               related_name='app_terms_author',)

    date_created = models.DateTimeField(_(u'created'), auto_now_add=True)
    date_modified = models.DateTimeField(_(u'last modified'), auto_now=True)
    date_published = models.DateTimeField(_(u'published Since'),
                                          default=timezone.now)
    date_published_end = models.DateTimeField(_(u'published Until'), null=True,
                                              blank=True)
    publish = models.BooleanField(_(u'publish'), default=False)
    categories = models.ManyToManyField(
        'app.AppCategory',
        verbose_name=_(u'category'),
        related_name='app_terms_categories',
    )
    main_image = FilerImageField(
        verbose_name=_(u'main image'),
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name='app_terms_image')
    main_image_thumbnail = models.ForeignKey(
        'cmsplugin_filer_image.ThumbnailOption',
        verbose_name=_(u'main image thumbnail'),
        related_name='app_terms_thumbnail',
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    main_image_full = models.ForeignKey('cmsplugin_filer_image.ThumbnailOption',
                                        verbose_name=_(u'main image full'),
                                        related_name='app_terms_full',
                                        on_delete=models.SET_NULL,
                                        blank=True, null=True)
    enable_comments = models.BooleanField(
        verbose_name=_(u'enable comments on terms agreement'),
        default=get_setting('ENABLE_COMMENTS'))
    sites = models.ManyToManyField(
        'sites.Site',
        verbose_name=_(u'Site(s)'),
        blank=True,
        null=True,
        help_text=_(
            u'Select sites in which to show the terms agreement '
            u'If none is set it will be '
            u'visible in all the configured sites.'))

    translations = TranslatedFields(
        title=models.CharField(_(u'title'), max_length=255),
        slug=models.SlugField(_(u'slug'), blank=True, db_index=True),
        abstract=HTMLField(_(u'abstract'), blank=True, default=''),
        meta_description=models.TextField(verbose_name=_(
            u'terms meta description'), blank=True, default=''),
        meta_keywords=models.TextField(verbose_name=_(u'terms meta keywords'),
                                       blank=True, default=''), meta_title=models.CharField(verbose_name=_(
            u'terms meta title'), help_text=_(
            u'used in title tag and social sharing'), max_length=255, blank=True,
            default=''), terms_text=HTMLField(_(u'text'), default='', blank=True),
        meta={'unique_together': [('slug', 'language_code',), ]},)
    content = PlaceholderField(
        'terms_content',
        related_name='app_terms_content')

    objects = GenericDateTaggedManager()
    tags = TaggableManager(blank=True, related_name='app_tags')

    _metadata = {
        'title': 'get_title',
        'description': 'get_description',
        'og_description': 'get_description',
        'twitter_description': 'get_description',
        'gplus_description': 'get_description',
        'keywords': 'get_keywords',
        'locale': None,
        #'image': 'get_image_full_url',
        'object_type': get_setting('TYPE'),
        'og_type': get_setting('FB_TYPE'),
        'og_app_id': get_setting('FB_APPID'),
        'og_profile_id': get_setting('FB_PROFILE_ID'),
        'og_publisher': get_setting('FB_PUBLISHER'),
        'og_author_url': get_setting('FB_AUTHOR_URL'),
        'twitter_type': get_setting('TWITTER_TYPE'),
        'twitter_site': get_setting('TWITTER_SITE'),
        'twitter_author': get_setting('TWITTER_AUTHOR'),
        'gplus_type': get_setting('GPLUS_TYPE'),
        'gplus_author': get_setting('GPLUS_AUTHOR'),
        'published_time': 'date_published',
        'modified_time': 'date_modified',
        'expiration_time': 'date_published_end',
        'tag': 'get_tags',
        'url': 'get_absolute_url',
    }

    class Meta:
        verbose_name = _('app terms')
        verbose_name_plural = _('app terms agreements')
        ordering = ('-date_published', '-date_created')
        get_latest_by = 'date_published'

    def __str__(self):
        return self.safe_translation_getter('title')

    def get_absolute_url(self):
        #import pdb; pdb.set_trace()
        kwargs = {
            'year': self.date_published.year,
            'month': '%02d' %
            self.date_published.month,
            'day': '%02d' %
            self.date_published.day,
            'article_slug': self.safe_translation_getter(
                'slug',
                language_code=get_language(),
                any_language=True)}
        return reverse('app:terms-detail', kwargs=kwargs)

    def save(self, *args, **kwargs):
        super(Terms, self).save(*args, **kwargs)
        main_lang = self.get_current_language()
        for lang in self.get_available_languages():
            self.set_current_language(lang)
            if not self.slug and self.title:
                self.slug = slugify(self.title)
        self.set_current_language(main_lang)
        self.save_translations()

    def get_title(self):
        title = self.safe_translation_getter('meta_title', any_language=True)
        if not title:
            title = self.safe_translation_getter('title', any_language=True)
        return title.strip()

    def get_keywords(self):
        return self.safe_translation_getter('meta_keywords').strip().split(',')

    def get_description(self):
        description = self.safe_translation_getter(
            'meta_description',
            any_language=True)
        if not description:
            description = self.safe_translation_getter(
                'abstract',
                any_language=True)
        return escape(strip_tags(description)).strip()

    def get_image_full_url(self):
        if self.main_image:
            return self.make_full_url(self.main_image.url)
        return ''

    def get_tags(self):
        taglist = [tag.name for tag in self.tags.all()]
        return ','.join(taglist)

    def get_author(self):
        return self.author

    def thumbnail_options(self):
        if self.main_image_thumbnail_id:
            return self.main_image_thumbnail.as_dict
        else:
            return get_setting('IMAGE_THUMBNAIL_SIZE')

    def full_image_options(self):
        if self.main_image_full_id:
            return self.main_image_full.as_dict
        else:
            return get_setting('IMAGE_FULL_SIZE')

    def get_full_url(self):
        return self.make_full_url(self.get_absolute_url())


# class TermsTranslation(TranslatedFieldsModel):
    #master = models.ForeignKey(Terms, related_name='translations', null=True)
    #slug = models.CharField(_("Slug"), max_length=200)

    # class Meta:
        #unique_together = ('language_code', 'master')
        #verbose_name = _("Terms translation")


@python_2_unicode_compatible
class BaseTermsPlugin(CMSPlugin):

    class Meta:
        abstract = True

    def terms_queryset(self, request=None):
        language = get_language()
        latest_termsagreements = Terms._default_manager.active_translations(
            language_code=language)
        if not request or not getattr(request, 'toolbar', False) or not request.toolbar.edit_mode:
            latest_termsagreements = latest_termsagreements.published()
        return latest_termsagreements

    def __str__(self):
        return force_text(self.latest_termsagreements)


class LatestTermsPlugin(BaseTermsPlugin):

    latest_termsagreements = models.IntegerField(
        _(u'termsagreements'),
        default=get_setting('LATEST_TERMSAGREEMENTS'),
        help_text=_(u'The number of latests terms agreements to be displayed.'))
    tags = TaggableManager(
        _(u'filter by tag'), blank=True, help_text=_(
            u'Show only the app terms agreements tagged with chosen tags.'),
        related_name='app_latest_terms')
    categories = models.ManyToManyField(
        'app.AppCategory',
        blank=True,
        verbose_name=_(u'filter by category'),
        help_text=_(u'Show only the app terms agreements tagged with chosen categories.'))

    def __str__(self):
        return _(
            u'%s latest terms agreements by tag') % self.latest_termsagreements

    def copy_relations(self, oldinstance):
        for tag in oldinstance.tags.all():
            self.tags.add(tag)

    def get_latest_termsagreements(self, request):
        latest_termsagreements = self.terms_queryset(request)
        if self.tags.exists():
            latest_termsagreements = latest_termsagreements.filter(
                tags__in=list(
                    self.tags.all()))
        if self.categories.exists():
            latest_termsagreements = latest_termsagreements.filter(
                categories__in=list(
                    self.categories.all()))
        return latest_termsagreements.distinct()[:self.latest_termsagreements]


class AuthorEntriesPlugin(BaseTermsPlugin):
    authors = models.ManyToManyField(
        dj_settings.AUTH_USER_MODEL, verbose_name=_('authors'),
        limit_choices_to={'app_terms_author__publish': True}
    )
    latest_termsagreements = models.IntegerField(
        _(u'termsagreements'), default=get_setting('LATEST_TERMSAGREEMENTS'),
        help_text=_(u'The number of author terms agreements to be displayed.')
    )

    def __str__(self):
        return _(
            u'%s latest terms agreements by author') % self.latest_termsagreements

    def copy_relations(self, oldinstance):
        self.authors = oldinstance.authors.all()

    def get_latest_termsagreements(self, request):
        latest_termsagreements = self.terms_queryset(request)
        return latest_termsagreements[:self.latest_termsagreements]

    def get_authors(self):
        authors = self.authors.all()
        for author in authors:
            author.count = 0
            if author.app_terms_author.filter(publish=True).exists():
                author.count = author.app_terms_author.filter(
                    publish=True).count()
        return authors
