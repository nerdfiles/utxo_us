# -*- coding: utf-8 -*-
from cms.toolbar_base import CMSToolbar
from cms.toolbar_pool import toolbar_pool
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _

from .models import APP_CURRENT_TERMS_IDENTIFIER


@toolbar_pool.register
class AppToolbar(CMSToolbar):

    def populate(self):
        # TODO: Readd if not self.is_current_app condition when CMS 3.0.4 is released
        if not self.request.user.has_perm('app.add_terms'):
            return   # pragma: no cover
        admin_menu = self.toolbar.get_or_create_menu('app', _('App'))
        url = reverse('admin:app_terms_changelist')
        admin_menu.add_modal_item(_('terms list'), url=url)
        url = reverse('admin:app_terms_add')
        admin_menu.add_modal_item(_('Add terms'), url=url)

        current_terms = getattr(self.request, APP_CURRENT_TERMS_IDENTIFIER, None)
        if current_terms and self.request.user.has_perm('app.change_terms'):   # pragma: no cover
            admin_menu.add_modal_item(_('Edit terms'), reverse(
                'admin:app_terms_change', args=(current_terms.pk,)),
                active=True)

    def terms_template_populate(self):
        current_terms = getattr(self.request, APP_CURRENT_TERMS_IDENTIFIER, None)
        if current_terms and self.request.user.has_perm('app.change_terms'):   # pragma: no cover
            # removing page meta menu, if present, to avoid confusion
            try:   # pragma: no cover
                import djangocms_page_meta  # NOQA
                menu = self.request.toolbar.get_or_create_menu('page')
                pagemeta = menu.get_or_create_menu('pagemeta', 'meta')
                menu.remove_item(pagemeta)
            except ImportError:
                pass
            # removing page tags menu, if present, to avoid confusion
            try:   # pragma: no cover
                import djangocms_page_tags  # NOQA
                menu = self.request.toolbar.get_or_create_menu('page')
                pagetags = menu.get_or_create_menu('pagetags', 'tags')
                menu.remove_item(pagetags)
            except ImportError:
                pass
