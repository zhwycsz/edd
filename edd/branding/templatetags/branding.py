from django import template
from django.contrib.sites.shortcuts import get_current_site

register = template.Library()


@register.simple_tag(takes_context=True)
def logo(context):
    try:
        request = context['request']
        site = get_current_site(request)
        logo_url = site.page.branding.logo_file.url
    except:
        # if there is no branding..do not show a logo
        logo_url = "/static/main/images/edd_letters.png"
    return logo_url


@register.simple_tag(takes_context=True)
def stylesheet(context):
    try:
        request = context['request']
        site = get_current_site(request)
        stylesheet_url = site.page.branding.style_sheet.url
    except:
        # if there is no branding..do not show a logo
        stylesheet_url = ""
    return stylesheet_url
