# UTXO

## Front End

### Structural Layer

#### Partials

AngularJS partials files are located in ``./partials/``.

#### Views

AngularJS views files are located in ``./views``.

#### Templates

Django and Django CMS templates files are located in ``./templates/``.

### Content Layer

Content Layer is facilitated by Django and Django CMS.

We use Django CMS Pages, and various Django CMS provided plugins:

1. Snippet
2. Text

### Presentation Layer

Source SCSS (SASS) files are located in ``./styles/``.

### Behavioral Layer

Source JavaScript files are located in ``./scripts``.

### Front End Vendor Layer

Source Vendor files are located in ``./static/bower_components/``.

### Vendor Output Layer

Vendor Files for Django, Django CMS, Django Plugins, and Front End Vendor Layer
are all built and located in ``../static/``.

Use ``$ python manage.py collectstatic`` to collect all necessary source front 
end vendor files and backend essential vendor client-side code.

## Backend

### Settings

Review ``./settings.py``.

### URL Routing

Review ``./urls.py``.

### Views

Review ``./views.py``.

### Context Processors

Review ``./context_processors.py``.
