# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-09-06 00:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skillsets', '0001_initial'),
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profileskillset',
            old_name='weight',
            new_name='profile_weight',
        ),
        migrations.RemoveField(
            model_name='profileskill',
            name='weight',
        ),
        migrations.AddField(
            model_name='profileskill',
            name='profile_weight',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='profileskillset',
            unique_together=set([('profile', 'profile_weight'), ('profile', 'skillset')]),
        ),
    ]