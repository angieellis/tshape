# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-09-10 21:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skillsets', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='skillset',
            name='description',
            field=models.TextField(blank=True, default='', verbose_name='description'),
        ),
    ]
