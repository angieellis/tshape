# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-23 03:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('skillsets', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('name', models.CharField(error_messages={'unique': 'A user with that email already exists.'}, max_length=280, unique=True, verbose_name='name')),
                ('description', models.TextField(verbose_name='description')),
                ('verified', models.BooleanField(default=False, verbose_name='verified')),
                ('skillset_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='skills', to='skillsets.Skillset', verbose_name='skillset id')),
            ],
            options={
                'verbose_name_plural': 'skills',
                'ordering': ('name',),
                'verbose_name': 'skill',
                'db_table': 'skills',
            },
        ),
    ]
