# Generated by Django 2.0.8 on 2018-10-08 19:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [("profile", "0004_userprofile_preferences")]

    operations = [migrations.RemoveField(model_name="userprofile", name="prefs")]
