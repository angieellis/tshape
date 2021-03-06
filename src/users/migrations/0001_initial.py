# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-08-31 02:52
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0007_alter_validators_add_error_messages'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(error_messages={'unique': 'A user with that email already exists.'}, max_length=254, unique=True, verbose_name='Email Address')),
                ('username', models.CharField(blank=True, error_messages={'unique': 'The username is already taken.'}, help_text='30 characters or fewer. Letters, digits and _ only.', max_length=30, null=True, unique=True, validators=[django.core.validators.RegexValidator('^\\w+$', 'Enter a valid username. This value may contain only letters, numbers and _ character.', 'invalid')], verbose_name='Username')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='Staff Status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='Active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Date Joined')),
                ('first_name', models.CharField(max_length=30, null=True, verbose_name='first name')),
                ('last_name', models.CharField(max_length=50, null=True, verbose_name='last name')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
                'db_table': 'users',
                'verbose_name_plural': 'Users',
                'verbose_name': 'User',
            },
        ),
    ]
