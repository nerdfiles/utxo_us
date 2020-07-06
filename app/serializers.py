# -*- coding: utf-8 -*-

from rest_framework import serializers


class SlackChatSerializer(serializers.Serializer):

    '''
    Slack Help Serializer
    '''
    message_construct = serializers.CharField(required=True, max_length=140)


class IdentitySerializer(serializers.Serializer):

    '''
    Person Identity Form Construct
    '''
    name_first = serializers.CharField(max_length=50)
    name_middle = serializers.CharField(max_length=50)
    name_last = serializers.CharField(max_length=50)
    birth_day = serializers.CharField(max_length=2)
    birth_month = serializers.CharField(max_length=2)
    birth_year = serializers.CharField(max_length=4)
    document_type = serializers.CharField(max_length=10)
    document_value = serializers.CharField(max_length=4)
    address_street1 = serializers.CharField(max_length=50)
    address_street2 = serializers.CharField(max_length=20)
    address_city = serializers.CharField(max_length=50)
    address_subdivision = serializers.CharField(max_length=2)
    address_postal_code = serializers.CharField(max_length=10)
    address_country_code = serializers.CharField(max_length=2)


class PhoneNumberSerializer(serializers.Serializer):

    '''
    Phone Number Form Construct
    '''
    phone_number = serializers.CharField(required=True, max_length=20)


class SmsRequestSerializer(serializers.Serializer):

    '''
    SMS Request Form Construct
    '''
    handle = serializers.CharField(required=True, max_length=20)
    message_construct = serializers.CharField(required=True, max_length=255)


class QuestionSetSerializer(serializers.Serializer):

    '''
    Question Set Form Construct
    '''
    question_set_id = serializers.CharField(max_length=50)  # by id


class OrderSerializer(serializers.Serializer):

    '''
    Phone Number For Latest Order Recall
    '''
    phone_number = serializers.CharField(required=True, max_length=20)
