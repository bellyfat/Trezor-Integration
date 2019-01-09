from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.utils.translation import gettext as _
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings

from .enum_choices import (
        WithdrawStatus, Network, NetworkName, TransactionType
    )


class HlorUser(models.Model):
    user = models.OneToOneField(User, related_name='hlor', on_delete=models.CASCADE)
    balance = models.DecimalField(
        max_digits=1000,
        decimal_places=18,
        null=False,
        blank=False,
        default='0',
        help_text='User Balance')
    wallet_address = models.CharField(
        max_length=255,
        null=False,
        blank=True,
        help_text='Wallet address')

    @property
    def username(self):
        return self.user.username

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name

    @property
    def email(self):
        return self.user.email

    @property
    def last_login(self):
        return self.user.last_login

    @property
    def date_joined(self):
        return self.user.date_joined

    class Meta:
        verbose_name = _('User of Hlor')
        verbose_name_plural = _('Users of Hlor')

    @receiver(post_save, sender=User)
    def create_hlor_user(sender, instance, created, **kwargs):
        if created:
            HlorUser.objects.create(user=instance)
            key = Key(user=instance, key=get_random_string(length=9), notes='My first key')
            key.save()


class Key(models.Model):
    @property
    def key_id(self):
        return self.id

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    key = models.CharField(_('Key'), max_length=32, default='def_')
    notes = models.CharField(_('Notes'), max_length=128)

    class Meta:
        verbose_name = _('Key')
        verbose_name_plural = _('Key')

class Withdraw(models.Model):
    """Withdraw model"""
    amount = models.DecimalField(
        max_digits=1000,
        decimal_places=18,
        null=False,
        blank=False,
        default='0',
        help_text='Amount')
    wallet_address = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        help_text='Wallet address')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        help_text='User ID')
    tx_hash = models.CharField(
        help_text='Transaction hash',
        max_length=150,
        null=False,
        blank=True)
    is_sent = models.BooleanField(default=False)
    status = models.CharField(
        choices=[(status.value, status.name) for status in WithdrawStatus],
        max_length=10,
        null=False,
        blank=False,
        default=WithdrawStatus.PENDING.value,
        help_text='Status')

    type_tx = models.CharField(
        choices=[(type_tx.value, type_tx.name) for type_tx in TransactionType],
        max_length=10,
        null=False,
        blank=True,
        help_text='Type of transaction')

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    @property
    def tx_hash_link(self):
        return "{}{}".format(SiteConfiguration.objects.first().network, self.tx_hash)

    class Meta:
        ordering = ['-id']

class SiteConfiguration(models.Model):
    """Site configuration model"""
    network = models.CharField(
        choices=[(network.value, network.name) for network in Network],
        max_length=150,
        null=False,
        blank=False,
        default=Network.RINKEBY.value,
        help_text='Network link')
    min_withdraw_amount = models.DecimalField(
        max_digits=1000,
        decimal_places=18,
        null=False,
        blank=False,
        default='0',
        help_text='Minimal withdraw amount')
    network_name = models.CharField(
        choices=[(name.value, name.name) for name in NetworkName],
        max_length=150,
        null=False,
        blank=False,
        default=NetworkName.RINKEBY.value,
        help_text='Network name')
