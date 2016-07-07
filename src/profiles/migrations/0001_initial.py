# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-04 22:30
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('skillsets', '0001_initial'),
        ('skills', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL, verbose_name='user')),
                ('first_name', models.CharField(max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(max_length=50, verbose_name='last name')),
                ('title', models.CharField(blank=True, max_length=280, verbose_name='title')),
                ('description', models.TextField(blank=True, verbose_name='description')),
                ('years_experience', models.IntegerField(blank=True, null=True, verbose_name='years of experience')),
                ('skills', models.ManyToManyField(to='skills.Skill', verbose_name='skills')),
                ('skillsets', models.ManyToManyField(to='skillsets.Skillset', verbose_name='skillsets')),
            ],
            options={
                'db_table': 'profiles',
                'verbose_name': 'profile',
                'ordering': ('last_name',),
                'verbose_name_plural': 'profiles',
            },
        ),
    ]
