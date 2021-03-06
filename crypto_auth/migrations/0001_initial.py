# Generated by Django 2.1.4 on 2019-01-03 15:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='HlorUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.DecimalField(decimal_places=0, default='0', help_text='User Balance', max_digits=1000)),
                ('wallet_address', models.CharField(help_text='Wallet address', max_length=255)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='hlor', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Users of Project',
                'verbose_name_plural': 'Users of Project',
            },
        ),
        migrations.CreateModel(
            name='Key',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(default='def_', max_length=32, verbose_name='Key')),
                ('notes', models.CharField(max_length=128, verbose_name='Notes')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Key',
                'verbose_name_plural': 'Key',
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=0, default='0', help_text='Amount', max_digits=1000)),
                ('wallet_address', models.CharField(help_text='Wallet address', max_length=255)),
                ('tx_hash', models.CharField(help_text='User ID', max_length=150)),
                ('is_sent', models.BooleanField(default=False)),
                ('status', models.CharField(choices=[('Pending', 'PENDING'), ('Failed', 'FAILED'), ('Success', 'SUCCESS')], default='Pending', help_text='Status', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(help_text='User ID', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
