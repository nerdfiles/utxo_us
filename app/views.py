#! /usr/bin/env python
# -*- coding: utf-8 -*-

""" ========================================== Core Dependencies  """


from django.shortcuts import render
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect

from django.contrib.auth import get_user_model
from django.core.urlresolvers import resolve
from django.utils.timezone import now
from django.utils.translation import get_language

from django.shortcuts import get_object_or_404, render_to_response
from django.template.context import RequestContext
import requests
import uuid
from django.utils.translation import ugettext_lazy as _

from parler.views import TranslatableSlugMixin, ViewUrlMixin
from django.views.generic import DetailView, ListView
from django.views.generic import TemplateView

from app.request_cache import get_request_cache
from django.core.cache import cache

from rest_framework.decorators import api_view, permission_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_extensions.cache.decorators import (
    cache_response
)

import json
from twilio.rest import TwilioRestClient
import blockscore

from rest_framework import permissions

from . import btce


class OnlyAjaxPermission(permissions.BasePermission):

    """
    Global permission check for blacklisted IPs.
    """

    def has_permission(self, request, view):
        csrf_cookie = request.META['CSRF_COOKIE']
        request_is_client = True
        if not csrf_cookie:
            request_is_client = False
        return request_is_client

""" ========================================== Additional Dependencies  """

from .settings import get_setting
from django.conf import settings
from .models import Terms
from .models import APP_CURRENT_TERMS_IDENTIFIER, AppCategory
from .forms import SubmitIdentity, SubmitPhoneNumber, SubmitQuestionSet, SubmitScoreQuestionSet
from .serializers import IdentitySerializer, PhoneNumberSerializer, QuestionSetSerializer, SmsRequestSerializer, SlackChatSerializer, OrderSerializer


""" ========================================== Environment Variables  """

User = get_user_model()

dev_twilio_account = "AC2df5751112ce10b674d852abe0fd3b11"
dev_twilio_token = "a1d6b1737f8f533da81855c690ce2dc0"

test_twilio_account = "AC057ea6d3280165882efa4b1a898f7a3f"
test_twilio_token = "e47372d1bd79acb09200784828e4381f"
prod_twilio_account = "AC2a0eef8002faf75292fd0bd77b88b896"
prod_twilio_token = "b0b7a6bd10a029956a57bff96e0deb80"

if settings.DEBUGSMS is True:
    twilio_account = dev_twilio_account
    twilio_token = dev_twilio_token
    source_number = "+17135889919"
    #source_number = "+12813775564"
else:
    twilio_account = prod_twilio_account
    twilio_token = prod_twilio_token
    source_number = "+12813775564"

_source_number = source_number
twilio_client = TwilioRestClient(twilio_account, twilio_token)

dev_test_key = 'sk_test_e415139895f6cd4edd6c248f2a72ad12'
prod_test_key = 'sk_test_3e8915ed527ffa299ce00d45f7aa2bdd'
prod_live_key = 'sk_live_40eedf77cdb95ff269c62180e6fe48a8'

if settings.DEBUGBLOCKSCORE is True:
    #bs_key = dev_test_key
    bs_key = prod_live_key
else:
    bs_key = prod_live_key

identity_validation_client = blockscore.Client({
    'api_key': bs_key,
})

baseApiUrl = 'https://utxo.firebaseio.com/'
baseProp = '/name.json'


""" ========================================== Utilities  """


def string_generator(string_length=10):
    """
    Returns a random string of length string_length.
    """

    random = str(uuid.uuid4())  # Convert UUID format to a Python string.
    random = random.upper()  # Make all characters uppercase.
    random = random.replace("-", "")  # Remove the UUID '-'.
    return random[0:string_length]  # Return the random string.

import datetime
from firebase.firebase import FirebaseApplication, FirebaseAuthentication
SECRET = 'Xp6C5DsnI4bi7qnA35hXzKYIPCLD8OSu3ZtDwFpZ'
DSN = 'https://utxo.firebaseio.com'
EMAIL = 'nerdfiles@gmail.com'
authentication = FirebaseAuthentication(SECRET, EMAIL, True, True)


def firebase_simple_get(request, entity):
    """
    Simple Firebase Get
    """
    firebase = FirebaseApplication(DSN, authentication)
    firebase_people_data = firebase.get(entity, None)
    return firebase_people_data


def firebase_namespace(request, section=None):
    """
    Firebase Namespace Allocator
    """
    firebase = FirebaseApplication(DSN, authentication)
    _id = None
    __id = None
    _property = None
    _current_kwargs = request.resolver_match.kwargs
    person_base = 'phone_number'
    property_base = 'property'
    method_construct = request.method

    try:
        captured_id = _current_kwargs['entity']
        __id = captured_id
        if __id:
            _id = __id
    except:
        _id = None
        print 'No id found in kwargs.'

    try:
        __property = _current_kwargs[property_base]
        if __property:
            _property = __property
    except:
        _property = None
        print 'No property found in kwargs.'

    if method_construct == 'GET':
        '''
        Initially use entity as phone_number to load user by property.
        '''

        try:
            captured_id = _current_kwargs['entity']
            __id = captured_id.replace('-', '')
            if __id:
                _id = __id
        except:
            _id = None
            print 'No id found in kwargs.'

        entity = '/people'
        _person_data = None
        firebase_people_data = firebase.get(entity, None)
        if bool(firebase_people_data):
            for person, person_data in firebase_people_data.iteritems():
                if person_data.get(person_base) is not None:
                    person_data['$id'] = person
                    entity_construct = person_data.get(
                        person_base).replace('-', '')
                    if _id == entity_construct:
                        _person_data = person_data
        return _person_data

    elif method_construct == 'PATCH':
        payload = request.data
        entity = '/people'
        sep = '/'
        itemId = payload['id']
        name = _property
        item_namespace = entity + sep + itemId
        firebase_people_data = firebase.patch(item_namespace, name, payload)

    elif method_construct == 'PUT':
        payload = request.data
        entity = '/people'
        sep = '/'
        item_namespace = entity

        if section is not None:
            itemId = _id
            item_namespace = entity + sep + itemId
            name = section
            firebase_people_data = firebase.put(item_namespace, name, payload)
            return firebase_people_data

        if hasattr(payload, 'id'):
            itemId = payload['id']
            item_namespace = entity + sep + itemId
        if _id is not None:
            item_namespace = entity + sep + _id
        name = _property
        payload.created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        firebase_people_data = firebase.put(item_namespace, name, payload)

    elif method_construct == 'POST':
        payload = request.data
        entity = '/people'
        sep = '/'
        item_namespace = entity
        if hasattr(payload, 'id'):
            itemId = payload['id']
            item_namespace = entity + sep + itemId
        payload.created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        firebase_people_data = firebase.post(item_namespace, payload)

    else:

        print 'No (relevant) HTTP Method provided.'
        firebase_people_data = None

    return firebase_people_data


""" ========================================== Views::Static Views  """

class AjaxView(TemplateView):
    template_name = 'ajax.html'


class HomeView(TemplateView):

    """
    Renders the home page.
    """

    template_name = 'home.html'


""" ========================================== Views::App Views  """


class BaseAppView(ViewUrlMixin):

    def get_queryset(self):
        language = get_language()
        queryset = self.model._default_manager.active_translations(
            language_code=language)
        if not getattr(self.request, 'toolbar', False) or not self.request.toolbar.edit_mode:
            queryset = queryset.published()
        return queryset.on_site()

    def render_to_response(self, context, **response_kwargs):
        response_kwargs['current_app'] = resolve(self.request.path).namespace
        return super(
            BaseAppView,
            self).render_to_response(
            context,
            **response_kwargs)


class TermsListView(BaseAppView, ListView):
    model = Terms
    context_object_name = 'terms_list'
    template_name = 'terms_list.html'
    paginate_by = get_setting('PAGINATION')
    view_url_name = 'termsagreements-latest'

    def get_context_data(self, **kwargs):
        context = super(TermsListView, self).get_context_data(**kwargs)
        context['TRUNCWORDS_COUNT'] = get_setting(
            'TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT')
        return context


class TermsDetailView(DetailView):
    model = Terms
    context_object_name = 'terms'
    template_name = 'terms_detail.html'
    slug_field = 'translations__slug'
    slug_url_kwarg = 'article_slug'

    view_url_name = 'terms-detail'

    def get(self, *args, **kwargs):
        # submit object to cms to get corrent language switcher and selected
        # category behavior
        if hasattr(self.request, 'toolbar'):
            self.request.toolbar.set_object(self.get_object())
        return super(TermsDetailView, self).get(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(TermsDetailView, self).get_context_data(**kwargs)
        context['meta'] = self.get_object().as_meta()
        context['use_placeholder'] = get_setting('USE_PLACEHOLDER')
        setattr(self.request, APP_CURRENT_TERMS_IDENTIFIER, self.get_object())
        return context


class TermsArchiveView(BaseAppView, ListView):
    model = Terms
    context_object_name = 'terms_list'
    template_name = 'terms_list.html'
    date_field = 'date_published'
    allow_empty = True
    allow_future = True
    paginate_by = get_setting('PAGINATION')
    view_url_name = 'termsagreements-archive'

    def get_queryset(self):
        qs = super(TermsArchiveView, self).get_queryset()
        if 'month' in self.kwargs:
            qs = qs.filter(
                **{'%s__month' % self.date_field: self.kwargs['month']})
        if 'year' in self.kwargs:
            qs = qs.filter(
                **{'%s__year' % self.date_field: self.kwargs['year']})
        return qs

    def get_context_data(self, **kwargs):
        kwargs['month'] = int(
            self.kwargs.get('month')) if 'month' in self.kwargs else None
        kwargs['year'] = int(
            self.kwargs.get('year')) if 'year' in self.kwargs else None
        if kwargs['year']:
            kwargs['archive_date'] = now().replace(
                kwargs['year'],
                kwargs['month'] or 1,
                1)
        context = super(TermsArchiveView, self).get_context_data(**kwargs)
        context['TRUNCWORDS_COUNT'] = get_setting(
            'TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT')
        return context


class TaggedListView(BaseAppView, ListView):
    model = Terms
    context_object_name = 'terms_list'
    template_name = 'terms_list.html'
    paginate_by = get_setting('PAGINATION')
    view_url_name = 'termsagreements-tagged'

    def get_queryset(self):
        qs = super(TaggedListView, self).get_queryset()
        return qs.filter(tags__slug=self.kwargs['tag'])

    def get_context_data(self, **kwargs):
        kwargs['tagged_entries'] = (self.kwargs.get('tag')
                                    if 'tag' in self.kwargs else None)
        context = super(TaggedListView, self).get_context_data(**kwargs)
        context['TRUNCWORDS_COUNT'] = get_setting(
            'TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT')
        return context


class AuthorEntriesView(BaseAppView, ListView):
    model = Terms
    context_object_name = 'terms_list'
    template_name = 'terms_list.html'
    paginate_by = get_setting('PAGINATION')
    view_url_name = 'termsagreements-authors'

    def get_queryset(self):
        qs = super(AuthorEntriesView, self).get_queryset()
        if 'username' in self.kwargs:
            qs = qs.filter(
                **
                {'author__%s' % User.USERNAME_FIELD: self.kwargs['username']})
        return qs

    def get_context_data(self, **kwargs):
        kwargs['author'] = User.objects.get(
            **{User.USERNAME_FIELD: self.kwargs.get('username')})
        context = super(AuthorEntriesView, self).get_context_data(**kwargs)
        context['TRUNCWORDS_COUNT'] = get_setting(
            'TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT')
        return context


class CategoryEntriesView(BaseAppView, ListView):
    model = Terms
    context_object_name = 'terms_list'
    template_name = 'terms_list.html'
    _category = None
    paginate_by = get_setting('PAGINATION')
    view_url_name = 'termsagreements-category'

    @property
    def category(self):
        if not self._category:
            self._category = AppCategory.objects.active_translations(
                get_language(),
                slug=self.kwargs['category']).latest('pk')
        return self._category

    def get(self, *args, **kwargs):
        # submit object to cms toolbar to get correct language switcher behavior
        if hasattr(self.request, 'toolbar'):
            self.request.toolbar.set_object(self.category)
        return super(CategoryEntriesView, self).get(*args, **kwargs)

    def get_queryset(self):
        qs = super(CategoryEntriesView, self).get_queryset()
        if 'category' in self.kwargs:
            qs = qs.filter(categories=self.category.pk)
        return qs

    def get_context_data(self, **kwargs):
        kwargs['category'] = self.category
        context = super(CategoryEntriesView, self).get_context_data(**kwargs)
        context['TRUNCWORDS_COUNT'] = get_setting(
            'TERMSAGREEMENTS_LIST_TRUNCWORDS_COUNT')
        return context


""" ========================================== Views::API Views  """

class BtcPrice(APIView):
    '''
    Bitcoin Averages Price Ticker
    '''
    queryset = User.objects.none()
    renderer_classes = (JSONRenderer, )

    @cache_response(60 * 15)
    def get(self, format=None):
        r = requests.get('https://api.bitcoinaverage.com/ticker/all')
        content = cache.get('avg_data')
        timeout = 60 * 60 * 12
        if not content:
            _content = json.loads(r.text)
            content = _content
            cache.set('avg_data', content, timeout)
        return Response(content)


class MapsListView(APIView):

    queryset = User.objects.all()
    renderer_classes = (JSONRenderer, )

    @cache_response(60 * 15)
    def get(self, request, format=None):
        """
        Get Map List View for People
        """

        map_data = {
            '$view': '__maps_list_view__',
            '$meta': True,
            'lat': 51.4800,
            'lng': 0.0000,
            'latlng': '51.4800,0.0000'
        }
        content = map_data
        return Response(content)


class BtcHistoricalView(APIView):

    '''
    Caching for Coindesk Historical BPI data.
    '''

    queryset = User.objects.none()
    renderer_classes = (JSONRenderer, )

    @cache_response(60 * 60 * 12)
    def get(self, request, format=None):
        """
        Get Map List View for People
        """

        baseHistoricalApi = 'http://api.coindesk.com/v1/bpi/historical/close.json'
        r = requests.get(baseHistoricalApi)
        #cache = get_request_cache()
        content = cache.get('close_data')
        timeout = 60 * 60 * 12
        if not content:
            _content = json.loads(r.text)
            content = _content
            cache.set('close_data', content, timeout)
        return Response(content)


class PeopleOrderDetailView(APIView):

    '''
    People Order Detail View

    Persons with orders.
    '''

    queryset = User.objects.none()

    def put(self, request, entity, timestamp, format=None):
        """
        Put Detail View
        """
        print 'PeopleOrderDetailView::put'
        order = firebase_namespace(request, section=timestamp)
        content = {'data': order}
        return Response(content)


@permission_classes((OnlyAjaxPermission, ))
class PeopleLocalDetailView(APIView):

    """
    A view to validate persons.
    """
    queryset = User.objects.none()

    #renderer_classes = (JSONRenderer, )

    def patch(self, request, entity, property, format=None):
        """
        Patch Detail View
        """
        print 'PeopleLocalDetailView::patch'
        person = firebase_namespace(request)
        content = {'data': person}
        return Response(content)

    def put(self, request, entity, property, format=None):
        """
        Put Detail View
        """
        print 'PeopleLocalDetailView::put'
        person = firebase_namespace(request)
        content = {'data': person}
        return Response(content)

    def post(self, request, entity, property, format=None):
        """
        Post Detail View
        """
        print 'PeopleLocalDetailView::post'
        person = firebase_namespace(request)
        content = {'data': person}
        return Response(content)

    #@cache_response(0)
    def get(self, request, entity, format=None):
        """
        Get List View for People
        """
        print 'PeopleLocalDetailView::get'
        people = firebase_namespace(request)
        content = {'data': people}
        response = Response(content)
        response['Cache-Control'] = 'no-cache'
        return response


class PeopleLocalListView(APIView):

    """
    A view to validate people lists.
    """
    queryset = User.objects.all()

    #renderer_classes = (JSONRenderer, )

    def post(self, request):
        """
        Post Person

        @note Is this being used?
        """
        print 'PeopleLocalListView::post'
        serializer = PhoneNumberSerializer(data=request.data)
        if serializer.is_valid():
            recipient_number = serializer.data['phone_number']
            person = firebase_namespace(request)

            content = {'data': person}
            return Response(content)

    #@cache_response(0)
    def get(self, request, cachebust, format=None):
        """
        Get List View for People
        """
        print 'PeopleLocalListView::get'
        print cachebust
        entity = '/people'
        firebase_people_data = firebase_simple_get(request, entity=entity)
        #import pdb; pdb.set_trace()
        content = {'data': firebase_people_data}
        response = Response(content)
        response['Cache-Control'] = 'no-cache'
        return response


class PeopleListView(APIView):

    """
    A view that returns the count of created identities in JSON.
    """

    queryset = User.objects.all()
    renderer_classes = (JSONRenderer, )

    identity_validation_client = blockscore.Client({
        'api_key': bs_key,
    })

    @cache_response(60 * 15)
    def get(self, request, format=None):
        """
        Get List View for People
        """

        people = self.identity_validation_client.people.all()
        content = {'data': people.body}
        return Response(content)


class PeopleDetailView(APIView):

    """
    Retrieve, update or delete a person instance.
    """
    queryset = User.objects.all()

    #renderer_classes = (JSONRenderer, )
    identity_validation_client = blockscore.Client({
        'api_key': bs_key,
    })

    def get_object(self, person_id):
        """
        Retrieve person instance from Blockscore.
        """

        try:
            people = self.identity_validation_client.people.retrieve(person_id)
            people_body = people.body
            return people_body
        except ObjectDoesNotExist:
            raise Http404

    def post(self, request, format=None):
        """
        This endpoint creates a new person. The information will be run
        through our verification process and then returned with additional
        information that will help you determine the authenticity of the
        information given.[0]

        —
        [0]: http://docs.blockscore.com/v4.0/python/#create-a-new-person
        """

        form = SubmitIdentity(request.POST)

        if form.is_valid():
            identity = {
                "name_first": form.cleaned_data['name_first'],
                "name_middle": form.cleaned_data['name_middle'],
                "name_last": form.cleaned_data['name_last'],
                "birth_day": form.cleaned_data['birth_day'],
                "birth_month": form.cleaned_data['birth_month'],
                "birth_year": form.cleaned_data['birth_year'],
                # Hardcoded by form
                "document_type": form.cleaned_data['document_type'],
                "document_value": form.cleaned_data['document_value'],
                "address_street1": form.cleaned_data['address_street1'],
                "address_street2": form.cleaned_data['address_street2'],
                "address_city": form.cleaned_data['address_city'],
                "address_subdivision": form.cleaned_data['address_subdivision'],
                "address_postal_code": form.cleaned_data['address_postal_code'],
                "address_country_code": form.cleaned_data['address_country_code'],
            }

            #json = person.json()
            #serializer = IdentitySerializer(data=json)
            #person_json = JSONRenderer().render(serializer.data)
            # if serializer.is_valid():
            # return render(
            #request, 'identity-creation-confirmation.html',
            #{'data': person_json})

            try:
                person = self.identity_validation_client.people.create(identity)
                person = person.body
                content = {'data': person}
                return Response(content)
            except ObjectDoesNotExist:
                raise Http404

    @cache_response(60 * 15)
    def get(self, request, person_id, format=None):
        """
        Load person instance by Id from Blockscore.
        """

        person = self.get_object(person_id)
        #serializer = PersonSerializer(person)
        # return Response(serializer.data)
        content = {'data': person}
        return Response(content)


class QuestionSetListView(APIView):

    '''
    Question Set List View
    '''
    queryset = User.objects.none()

    renderer_classes = (JSONRenderer, )

    identity_validation_client = blockscore.Client({
        'api_key': bs_key,
    })

    @cache_response(60 * 15)
    def get(self, request, format=None):
        """
        Get Question Set List.
        """

        try:
            _question_sets = self.identity_validation_client.question_sets.all()
            question_sets = _question_sets.body
            content = {'data': question_sets}
            return Response(content)
        except ObjectDoesNotExist:
            raise Http404


class QuestionSetDetailView(APIView):

    """
    Question Set Detail View
    """
    queryset = User.objects.none()

    renderer_classes = (JSONRenderer, )

    identity_validation_client = blockscore.Client({
        'api_key': bs_key,
    })

    def get_object(self, question_set_id, format=None):
        """
        Retrieve question set instance from Blockscore.
        """
        try:
            question_set = self.identity_validation_client.question_sets.retrieve(
                question_set_id)
            question_set_body = question_set.body
            return question_set_body
        except ObjectDoesNotExist:
            raise Http404

    def post(self, request):
        """
        Create Question Set from Person Id
        """

        form = SubmitQuestionSet(request.POST)

        if form.is_valid():
            person_id = form.cleaned_data['person_id']
            question_set = self.identity_validation_client.question_sets.create(
                person_id=person_id)
            #question_set = self.identity_validation_client.question_sets.create(person_id=person_id, time_limit=5000)
            # @note Optional time_limit argument actually causes a 500 error, and is not expected. This is an issue with blockscore's API.
            #       Further, question sets that are created through the API currently create a score expectation of "null" which is different
            # from what is documented at
            # https://docs.blockscore.com/v4.0/python/#create-a-new-question-set.
            question_set = question_set.body
            content = {'data': question_set}
            return Response(content)

    @cache_response(60 * 15)
    def get(self, request, question_set_id, format=None):
        """
        This allows you to retrieve a question set you have created. If you have already
        scored the question set, we will also return the last score of your submitted answers.
        """
        question_set = self.get_object(question_set_id)
        content = {'data': question_set}
        return Response(content)


class QuestionSetScoreDetailView(APIView):

    """
    Question Set Score Detail View Creation.
    """
    queryset = User.objects.all()

    #renderer_classes = (JSONRenderer, )

    identity_validation_client = blockscore.Client({
        'api_key': bs_key,
    })

    def post(self, request, question_set_id):
        """
        Create score validation for question set.
        """

        #form = SubmitScoreQuestionSet(request.POST)

        # if form.is_valid():

        question_1 = {
            'question_id': 1,
            'answer_id': int(request.POST['qc1'])
        }

        question_2 = {
            'question_id': 2,
            'answer_id': int(request.POST['qc2'])
        }

        question_3 = {
            'question_id': 3,
            'answer_id': int(request.POST['qc3'])
        }

        question_4 = {
            'question_id': 4,
            'answer_id': int(request.POST['qc4'])
        }

        question_5 = {
            'question_id': 5,
            'answer_id': int(request.POST['qc5'])
        }

        answer_construct = [
            question_1,
            question_2,
            question_3,
            question_4,
            question_5,
        ]

        score = self.identity_validation_client.question_sets.score(
            question_set_id,
            answer_construct)
        score = score.body

        content = {'data': score}
        return Response(content)


class BlockchainAddressDetailView(APIView):

    '''
    Blockchain Address Detail View
    '''
    queryset = User.objects.none()

    @cache_response(60 * 15)
    def get(self, address, request):
        '''
        @return
            hash160 : str
            address : str
            n_tx : int
            total_received : int
            total_sent : int
            final_balance : int
            transactions : array of Transaction objects
        '''
        from blockchain import blockexplorer
        address_data = blockexplorer.get_address(address)
        content = {'data': address_data}
        return Response(content)


class SmsDetailView(APIView):

    '''
    SMS Detail View
    '''
    queryset = User.objects.none()

    def post(self, request):
        '''
        Post Arbitrary Message by Phone Number
        '''

        serializer = SmsRequestSerializer(data=request.data)
        if serializer.is_valid():
            recipient_number = serializer.data['handle']
            sender_number = _source_number
            message_construct = serializer.data['message_construct']

            try:
                message = twilio_client.messages.create(
                    to=recipient_number,
                    from_=sender_number,
                    body=message_construct)

                content = {'data': message.body}
                return Response(content)

            except ObjectDoesNotExist:
                raise Http404


class LatestOrderDetailView(APIView):

    '''
    Latest Order Detail View
    '''
    queryset = User.objects.none()

    def post(self, request):
        '''
        Latest Order Post
        '''
        serializer = OrderSerializer(data=request.data)
        print request.data
        if serializer.is_valid():
            session_number = serializer.data['phone_number']
            try:
                firebase_session_data = firebase_simple_get(
                    request,
                    entity='/people/' +
                    session_number)
                content = {'data': firebase_session_data}
                return Response(content)
            except ObjectDoesNotExist:
                raise Http404


class TickerDetailView(APIView):

    '''
    Ticker Detail View
    '''

    @cache_response(60 * 15)
    def get(self, request):
        try:
            btcepapi = btce.PublicAPIv3('btc_usd')
            ticker_data = btcepapi.call('ticker', limit=10, ignore_invalid=1)
            content = {'data': ticker_data}
            return Response(content)
        except ObjectDoesNotExist:
            raise Http404


class ScraperPositionView(APIView):

    '''
    Scraper Positioning View
    '''

    def get(self, request, latlng):
        r = requests.get(
            'http://maps.googleapis.com/maps/api/geocode/json?latlng=%s&sensor=true' %
            (latlng,))
        _content = json.loads(r.text)
        content = _content

        try:
            return Response(content)
        except ObjectDoesNotExist:
            raise Http404


class ScraperDetailView(APIView):

    '''
    Scraper Detail View
    '''

    @cache_response(60 * 15)
    def get(self, request, postalcode):
        '''
        Ugh
        '''
        from bs4 import BeautifulSoup
        import re
        firebase = FirebaseApplication(DSN, authentication)
        firebase_locales_directory = firebase.get('/locales/directory', None)
        location_found = False
        for idx in enumerate(firebase_locales_directory):
            if idx[1].find(postalcode) is not -1:
                location_found = True
                print 'Local location found.'

            if location_found is False:
                _postalcode = int(postalcode) + 1
                if idx[1].find(str(_postalcode)) is not -1:
                    location_found = True
                    print 'Local location found.'

            if location_found is False:
                _postalcode = int(postalcode) - 1
                if idx[1].find(str(_postalcode)) is not -1:
                    location_found = True
                    print 'Local location found.'

        try:
            if location_found is False:
                print 'Pinging https://co-opcreditunions.org.'
                r = requests.get(
                    'https://co-opcreditunions.org/locator/search-results/?loctype=S&zip=' +
                    postalcode +
                    '&cuname=&maxradius=20&country=&Submit=Search')
                soup = BeautifulSoup(r.text, "html5lib")
                scripts = [s.extract() for s in soup('script')]
                locations = []
                data = scripts[7].text
                first_pass = data.split(']]')
                second_pass = first_pass[0].split('[[')
                third_pass = second_pass[1].split('],[')
                if len(firebase_locales_directory) > 0:
                    locations = firebase_locales_directory
                else:
                    locations = []
                for idx in enumerate(third_pass):
                    location_datum = idx[1]
                    reversed_location_datum = location_datum[::-1]
                    final_full_location_datum = reversed_location_datum[::-1]
                    locations.append(final_full_location_datum)
                firebase_people_data = firebase.put(
                    '/locales',
                    'directory',
                    locations)
            else:
                firebase_people_data = firebase_locales_directory
            content = {'data': firebase_people_data}
            return Response(content)
        except ObjectDoesNotExist:
            raise Http404


class LocalesListView(APIView):

    '''
    Locales Data
    '''

    @cache_response(60 * 15)
    def get(self, request):
        try:
            firebase_locales_data = firebase_simple_get(
                request,
                entity='/locales/directory')
            content = {'data': firebase_locales_data}
            return Response(content)
        except ObjectDoesNotExist:
            raise Http404


from pyslack import SlackClient


class SlackOrdersView(APIView):

    #renderer_classes = (JSONRenderer, )

    def post(self, request):
        serializer = SlackChatSerializer(data=request.data)
        client = SlackClient(
            'xoxp-4254176702-8269771440-11734785028-c59bdd6fab')
        if serializer.is_valid():
            try:
                message_construct = serializer.data['message_construct']
                chat_message = client.chat_post_message(
                    '#orders',
                    message_construct,
                    username='slackbot')
                content = {'data': chat_message}
                return Response(content)

            except ObjectDoesNotExist:
                raise Http404


class SlackDetailView(APIView):

    #renderer_classes = (JSONRenderer, )

    def post(self, request):
        serializer = SlackChatSerializer(data=request.data)
        client = SlackClient(
            'xoxp-4254176702-8269771440-11734785028-c59bdd6fab')
        if serializer.is_valid():
            try:
                message_construct = serializer.data['message_construct']
                chat_message = client.chat_post_message(
                    '#help',
                    message_construct,
                    username='slackbot')
                content = {'data': chat_message}
                return Response(content)

            except ObjectDoesNotExist:
                raise Http404


class SlackNotificationView(APIView):

    def post(self, request):
        import json
        payload = {
            'text': 'Verification Started for a new user!'
        }
        res_url = 'https://hooks.slack.com/services/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'
        res_code = requests.post(
            res_url,
            json=payload
        )
        content = {'data': res_code}
        return Response(content)


class ValidationDetailView(APIView):

    '''
    Validation Detail View.
    '''
    queryset = User.objects.none()

    #renderer_classes = (JSONRenderer, )

    def post(self, request):
        '''
        Authenicate by Phone Number
        '''

        serializer = PhoneNumberSerializer(data=request.data)
        print request.data
        if serializer.is_valid():
            recipient_number = serializer.data['phone_number']
            sender_number = _source_number
            _recipient_number = "+1" + recipient_number

            validation_construct = string_generator(string_length=6)
            validation_message = 'Please provide the following validation number: %s' % (
                validation_construct,)
            try:
                message = twilio_client.messages.create(
                    to=_recipient_number,
                    from_=sender_number,
                    body=validation_message)

                print message.body

                content = {'data': message.body}
                return Response(content)

            except ObjectDoesNotExist:
                raise Http404


def login_view(request):
    return HttpResponseRedirect('/dashboard/?next=%s' % request.path)
