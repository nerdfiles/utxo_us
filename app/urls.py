#! /usr/bin/env python
# -*- coding: utf-8 -*-
from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.template.context import RequestContext
#from django.contrib.staticfiles.urls import staticfiles_urlpatterns
#from djangocms_page_sitemap.sitemap import ExtendedSitemap

from rest_framework.urlpatterns import format_suffix_patterns

from cms.models.pagemodel import Page
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers, viewsets, routers
from django.contrib.auth.models import User
#from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    MapsListView,
    BtcHistoricalView,
    BtcPrice,
    AuthorEntriesView,
    CategoryEntriesView,
    TermsArchiveView,
    TermsDetailView,
    TermsListView,
    TaggedListView)

#from .views import terms_detail
from .views import HomeView
from .views import login_view
#from .views import TermsView
from .views import ValidationDetailView
from .views import PeopleLocalDetailView
from .views import PeopleDetailView
from .views import PeopleListView
from .views import PeopleLocalListView
from .views import QuestionSetListView
from .views import QuestionSetDetailView
from .views import QuestionSetScoreDetailView
from .views import PeopleOrderDetailView
from .views import BlockchainAddressDetailView
from .views import SmsDetailView
from .views import SlackDetailView
from .views import TickerDetailView
from .views import ScraperDetailView
from .views import LocalesListView
from .views import LatestOrderDetailView
from .views import SlackOrdersView
from .views import SlackNotificationView
from .views import ScraperPositionView

from django.shortcuts import render_to_response
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import filters


admin.autodiscover()


class PageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Page


class PageListView(generics.ListAPIView):
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    def get(self, request):
        return Response(queryset)

from cms import models
from django import template

#from cms.plugin_rendering import render_placeholder


# def render_placeholder(queryset, request):
    #placeholder = queryset[0].placeholders.get(slot='LeftPanelContentArea')
    #context = template.RequestContext(request)
    # return placeholder[0].render(context, width=None)


class PageDetailView(APIView):
    serializer_class = PageSerializer
    model = serializer_class.Meta.model

    def get_queryset(self):
        title = None
        if 'pagename' in self.kwargs:
            title = self.kwargs['pagename']

        if title is None:
            title = u'home'
        queryset = self.model.objects.search(title)
        return queryset

    def get(self, request, pagename='home'):
        if pagename is None:
            pagename = u'home'

        queryset = self.model.objects.search(pagename)
        object = get_object_or_404(Page, id=queryset[0].pk)

        return render_to_response('utxo/_' + pagename + '.html', {
            'object': object
        }, context_instance=RequestContext(request))


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'is_staff')


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('username', 'email')


class CurrentUserView(APIView):
    queryset = User.objects.all()

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


router = routers.DefaultRouter()
#router.register(r'users', UserViewSet)


urlpatterns = patterns(
    '', url(r'^api/', include(router.urls)),
)

urlpatterns = patterns(
    '',
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url('^api/users/$', UserListView.as_view()),
    url('^api/users/current/$', CurrentUserView.as_view()),
    url('^api/cms/pages/$', PageListView.as_view()),
    url('^api/cms/page/((?P<pagename>.*)?/)?$', PageDetailView.as_view()),
    url('^api/cms/', include('djangocms_restapi.urls')),)


if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
                            url(r'^__debug__/', include(debug_toolbar.urls)),
                            )


terms_patterns = patterns('',
                          url(r'^latest/$',
                              TermsListView.as_view(),
                              name='termsagreements-latest',),

                          #url(r'^feed/$', LatestEntriesFeed(), name='termsagreements-latest-feed'),
                          url(r'^(?P<year>\d{4})/$',
                              TermsArchiveView.as_view(),
                              name='termsagreements-archive'),
                          url(r'^(?P<year>\d{4})/(?P<month>\d{1,2})/$',
                              TermsArchiveView.as_view(),
                              name='termsagreements-archive'),
                          url(
                              r'^(?P<year>\d{4})/(?P<month>\d{1,2})/(?P<day>\d{1,2})/(?P<article_slug>\w[-\w]*)/$',
                              TermsDetailView.as_view(),
                              name='terms-detail'),
                          url(r'^author/(?P<username>[\w\.@+-]+)/$',
                              AuthorEntriesView.as_view(),
                              name='termsagreements-author'),
                          url(r'^category/(?P<category>[\w\.@+-]+)/$',
                              CategoryEntriesView.as_view(),
                              name='termsagreements-category'),
                          url(r'^tag/(?P<tag>[-\w]+)/$',
                              TaggedListView.as_view(),
                              name='termsagreements-tagged'),
                          #url(r'^tag/(?P<tag>[-\w]+)/feed/$', TagFeed(), name='termsagreements-tagged-feed'),
                          #(r'^djga/', include('google_analytics.urls')),
                          #url(r'^terms/', include((terms_patterns, 'app', 'app-terms'))),
                          url(r'^maps/credit-unions/nearest', MapsListView.as_view(), name='maps-nearest',),)


urlpatterns += patterns('',

                        url(r'^help', SlackDetailView.as_view(),
                            name="slack-help",),

                        url(r'^verification/start', SlackNotificationView.as_view(), name="slack-notification",),

                        url(r'^place-order', SlackOrdersView.as_view(), name="slack-placeorder",),

                        url(r'^ticker/avg$', BtcPrice.as_view(), name='btc-avg',),
                        url(r'^ticker/historical$', BtcHistoricalView.as_view(), name='btc-historical',),
                        url(r'^ticker$', TickerDetailView.as_view(), name="ticker-help",),

                        url(r'^scraper/position/(?P<latlng>.*)', ScraperPositionView.as_view(), name="scraper-position",),
                        url(r'^scraper/(?P<postalcode>.*)',
                            ScraperDetailView.as_view(), name="scraper-help",),

                        url(r'^locales', LocalesListView.as_view(),
                            name='locales-help'),

                        url(r'^orders/latest', LatestOrderDetailView.as_view(),
                            name='order-latest-help'),

                        url(r'^blockchain/address/(?P<address>.*)/$',
                            BlockchainAddressDetailView.as_view(),
                            name='btc-local-detail-view'),

                        url(r'^people/list/(?P<cachebust>[0-9-]+)/$', PeopleLocalListView.as_view(),
                            name='people-local-list-view'),

                        url(r'^people/$', PeopleLocalListView.as_view(),
                            name='people-local-list-view-update'),

                        url(r'^people/(?P<entity>[0-9-]+)/$',
                            PeopleLocalDetailView.as_view(),
                            name='people-local-detail-view'),

                        url(r'^orders/(?P<entity>[\w-]+)/((?P<timestamp>.*)/)?$',
                            PeopleOrderDetailView.as_view(),
                            name='people-local-detail-view-with-property'),

                        url(r'^people/(?P<entity>[\w-]+)/((?P<property>\w+)/)$',
                            PeopleLocalDetailView.as_view(),
                            name='people-local-detail-view-with-property'),)

urlpatterns += i18n_patterns('',
                        url(r'^accounts/login/$', login_view),
                        url(r'^grappelli/', include('grappelli.urls')),
                        url(r'^dashboard/', include(admin.site.urls)),
                        url(r'^nested_admin/', include('nested_admin.urls')),
                        (r'^taggit_autosuggest/',
                         include('taggit_autosuggest.urls')),
                        (r'^ckeditor/', include('ckeditor_uploader.urls')),
                        url('^', include('django.contrib.auth.urls')),
                        url(r'^', include('cms.urls')),
                        )


urlpatterns += patterns('',

                        # url(r'^sitemap\.xml$',
                        #    'django.contrib.sitemaps.views.sitemap',
                        #    {'sitemaps': {'cmspages': ExtendedSitemap}}),

                        # url(r'^$',
                        # HomeView.as_view(),
                        # name='home',),

                        # url(r'^views/terms.html',
                        # TermsView.as_view(),
                        # name='home',),

                        # url(r'^views/terms.html',
                        # terms_detail,
                        # name="terms-view"),

                        url(r'^verify/person',
                            PeopleDetailView.as_view(),
                            name='people-detail-view'),

                        url(r'^verify/person/(?P<person_id>\w+)',
                            PeopleDetailView.as_view(),
                            name='people-detail-view-load'),

                        url(r'^verify/people',
                            PeopleListView.as_view(),
                            name='people-list-view'),

                        url(r'^question-set/validate/(?P<question_set_id>[a-zA-Z0-9]+)',
                            QuestionSetScoreDetailView.as_view(),
                            name='question-set-score-detail-view'),

                        url(r'^question-set',
                            QuestionSetDetailView.as_view(),
                            name='question-set-detail-view'),

                        url(r'^question-set/(?P<question_set_id>\w+)',
                            QuestionSetDetailView.as_view(),
                            name='question-set-detail-view-load'),

                        url(r'^question-sets',
                            QuestionSetListView.as_view(),
                            name='question-set-list-view'),

                        url(r'^a/request',
                            SmsDetailView.as_view(),
                            name='sms-request-detail-view'),

                        url(r'^authentication/request',
                            ValidationDetailView.as_view(),
                            name='sms-detail-view'),)



if settings.DEBUG404:

    urlpatterns += patterns('',
                            url(r'^static/(?P<path>.*)$',
                                'django.views.static.serve',
                                {'document_root': settings.STATIC_ROOT,
                                 'show_indexes': True}),
                            url(r'^media/(?P<path>.*)$',
                                'django.views.static.serve',
                                {'document_root': settings.MEDIA_ROOT,
                                 'show_indexes': True}),
                            url(r'',
                                include('django.contrib.staticfiles.urls')),)
