from django import forms
from django.conf import settings
from taggit_autosuggest.widgets import TagAutoSuggest




class SubmitIdentity(forms.Form):

    '''
    Person Identity Form Construct
    '''
    name_first = forms.CharField(max_length=50)
    name_middle = forms.CharField(max_length=50, required=False)
    name_last = forms.CharField(max_length=50)
    birth_day = forms.CharField(max_length=2)
    birth_month = forms.CharField(max_length=2)
    birth_year = forms.CharField(max_length=4)
    document_type = forms.CharField(max_length=3)
    document_value = forms.CharField(max_length=4)
    address_street1 = forms.CharField(max_length=50)
    address_street2 = forms.CharField(max_length=20, required=False)
    address_city = forms.CharField(max_length=50)
    address_subdivision = forms.CharField(max_length=50)
    address_postal_code = forms.CharField(max_length=10)
    address_country_code = forms.CharField(max_length=2)


class SubmitPhoneNumber(forms.Form):

    '''
    Phone Number Form Construct
    '''
    phone_number = forms.CharField(max_length=20)

class SubmitScoreQuestionSet(forms.Form):

    '''
    Score Question Set Form Construct
    '''
    id = forms.CharField(max_length=100)


class SubmitQuestionSet(forms.Form):

    '''
    Question Set Form Construct
    '''
    person_id = forms.CharField(max_length=100)


class LatestEntriesForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(LatestEntriesForm, self).__init__(*args, **kwargs)
        self.fields['tags'].widget = TagAutoSuggest('taggit.Tag')

    class Media:
        css = {
            'all': ('%s%s' % (settings.STATIC_URL,
                                                 'app_admin.css'),)
        }
