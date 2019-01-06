from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse

from singlemodeladmin import SingleModelAdmin

from .models import Withdraw, HlorUser, SiteConfiguration
from .views import WithdrawListView


@admin.register(Withdraw)
class WithdrawAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'amount', 'is_sent', 'withdraw_actions', 'status', 'tx_link',
        'created_at', 'wallet_address',
    ]
    list_filter = ['tx_hash', 'is_sent', 'status', ]
    change_list_template = "admin/crypto_auth/withdraw_list.html"

    def withdraw_actions(self, obj):
        button_init = """
            <input type="submit" id="id_{0}"
            class="btn btn-outline-info btn-sm"
            name="button_tx"
            item-id="{0}"
            data-href="/update-tx/{0}"
            value="Sign" amount="{1}"
            style='opacity: 0.8;padding: 2px 15px;'>
            """.format(obj.id, obj.amount)
        button_sent = """
            <input type='submit' id='id_{}' 
            class='btn btn-outline-success btn-sm'
            name='button_tx'
            value='Sent'
            style='opacity: 0.8;padding: 2px 15px;
            background-color: transparent; cursor: default;' disabled>
            """.format(obj.id)
        if obj.is_sent:
            return format_html(button_sent)
        else:
            return format_html(button_init)

    def tx_link(self, obj):
        if obj.tx_hash:
            link = "<a target='_blank' href='{}'>{}</a>".format(obj.tx_hash_link, obj.tx_hash)
            return format_html(link)
        else:
            return ""

    withdraw_actions.short_description = 'Withdraw Actions'
    withdraw_actions.allow_tags = True


@admin.register(HlorUser)
class HlorUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'wallet_address', 'balance', ]
    list_filter = ['id', 'user', 'wallet_address', 'balance', ]


@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(SingleModelAdmin):
    pass
