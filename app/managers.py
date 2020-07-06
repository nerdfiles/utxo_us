# -*- coding: utf-8 -*-

"""
Managers
"""

try:
    from collections import Counter
except ImportError:
    from .compat import Counter

import django
from django.contrib.sites.models import Site
from django.db import models
from django.utils.timezone import now
from parler.managers import TranslatableQuerySet, TranslationManager


class TaggedFilterItem(object):

    def tagged(self, other_model=None, queryset=None):
        """
        Tagged
        """
        tags = self._taglist(other_model, queryset)
        return self.get_queryset().filter(taglist__in=tags)

    def _taglist(self, other_model=None, queryset=None):
        """
        Taglist
        """
        from taggit.models import TaggedItem
        filter_construct = None
        if queryset is not None:
            filter_construct = set()
            for item in queryset.all():
                filter_construct.update(item.tags.all())
            filter_construct = set([tag.id for tag in filter_construct])
        elif other_model is not None:
            filter_construct = set(TaggedItem.objects.filter(content_type__model=other_model.__name__.lower()).values_list('tag_id', flat=True))
        tags = set(TaggedItem.objects.filter(content_type__model=self.model.__name__.lower()).values_list('tag_id', flat=True))
        if filter_construct is not None:
            tags = tags.intersection(filter_construct)
        return list(tags)

    def tag_list(self, other_model=None, queryset=None):
        """
        Restituisce un queryset di tag comuni al model corrente e
        al model o queryset passati come argomento
        """
        from taggit.models import Tag
        return Tag.objects.filter(id__in=self._taglist(other_model, queryset))

    def tag_list_slug(self, other_model=None, queryset=None):
        queryset = self.tag_list(other_model, queryset)
        return queryset.values('slug')

    def tag_cloud(self, other_model=None, queryset=None, published=True):
        from taggit.models import TaggedItem
        tag_ids = self._taglist(other_model, queryset)
        kwargs = {}
        if published:
            kwargs = TaggedItem.bulk_lookup_kwargs(self.model.objects.published())
        kwargs['tag_id__in'] = tag_ids
        counted_tags = dict(TaggedItem.objects
                                      .filter(**kwargs)
                                      .values('tag')
                                      .annotate(count=models.Count('tag'))
                                      .values_list('tag', 'count'))
        tags = TaggedItem.tag_model().objects.filter(pk__in=counted_tags.keys())
        for tag in tags:
            tag.count = counted_tags[tag.pk]
        return sorted(tags, key=lambda x: -x.count)


class GenericDateQuerySet(TranslatableQuerySet):
    start_date_field = 'date_published'
    end_date_field = 'date_published_end'
    publish_field = 'publish'

    def on_site(self):
        return self.filter(models.Q(sites__isnull=True) |
                           models.Q(sites=Site.objects.get_current().pk))

    def published(self):
        queryset = self.published_future()
        if self.start_date_field:
            return queryset.filter(
                **{'%s__lte' % self.start_date_field: now()})
        else:
            return queryset

    def published_future(self):
        queryset = self.on_site()
        if self.end_date_field:
            qfilter = (
                models.Q(**{'%s__gte' % self.end_date_field: now()})
                | models.Q(**{'%s__isnull' % self.end_date_field: True})
            )
            queryset = queryset.filter(qfilter)
        return queryset.filter(**{self.publish_field: True})

    def archived(self):
        queryset = self.on_site()
        if self.end_date_field:
            qfilter = (
                models.Q(**{'%s__lte' % self.end_date_field: now()})
                | models.Q(**{'%s__isnull' % self.end_date_field: False})
            )
            queryset = queryset.filter(qfilter)
        return queryset.filter(**{self.publish_field: True})

    def available(self):
        return self.on_site().filter(**{self.publish_field: True})

    def filter_by_language(self, language):
        return self.active_translations(language_code=language).on_site()


class GenericDateTaggedManager(TaggedFilterItem, TranslationManager):
    use_for_related_fields = True

    queryset_class = GenericDateQuerySet

    def get_queryset(self, *args, **kwargs):
        try:
            return super(GenericDateTaggedManager, self).get_queryset(*args, **kwargs)
        except AttributeError:  # pragma: no cover
            return super(GenericDateTaggedManager, self).get_query_set(*args, **kwargs)
    if django.VERSION < (1, 8):
        get_query_set = get_queryset

    def published(self):
        return self.get_queryset().published()

    def available(self):
        return self.get_queryset().available()

    def archived(self):
        return self.get_queryset().archived()

    def published_future(self):
        return self.get_queryset().published_future()

    def filter_by_language(self, language):
        return self.get_queryset().filter_by_language(language)

    def get_months(self, queryset=None):
        """
        Get months with aggregate count (how much terms agreements is in the month). Results are ordered by date.
        """
        if queryset is None:
            queryset = self.get_queryset()
        queryset = queryset.on_site()
        dates = queryset.values_list(queryset.start_date_field, flat=True)
        dates = [(x.year, x.month) for x in dates]
        date_counter = Counter(dates)
        dates = set(dates)
        dates = sorted(dates, reverse=True)
        return [{'date': now().replace(year=year, month=month, day=1),
                 'count': date_counter[year, month]} for year, month in dates]
