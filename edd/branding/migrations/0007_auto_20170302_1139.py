# -*- coding: utf-8 -*-
# Generated by Django 1.9.11 on 2017-03-02 19:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('branding', '0006_remove_branding_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='branding',
            name='flavicon_file',
            field=models.ImageField(null=True, upload_to='uploads/'),
        ),
        migrations.AlterField(
            model_name='branding',
            name='logo_file',
            field=models.ImageField(null=True, upload_to='uploads/'),
        ),
    ]
