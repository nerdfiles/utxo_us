from django.conf.urls import patterns, include, url
from views import AjaxView

urlpatterns = patterns('',
    url(r'^object/(?P<object>.*)/$', AjaxView.as_view()),)

