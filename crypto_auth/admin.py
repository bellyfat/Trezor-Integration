from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse

from singlemodeladmin import SingleModelAdmin

from .models import Transaction, HlorUser, SiteConfiguration
from .views import TransactionListView


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'tx_hash', 'is_sent', 'status', 'transaction_actions', ]
    list_filter = ['tx_hash', 'is_sent', 'status', ]
    change_list_template = "admin/crypto_auth/transaction_list.html"

    def transaction_actions(self, obj):
        button_init = """
            <input type="submit" id="id_{0}" 
            class="btn btn-outline-info btn-sm" 
            name="button_tx" 
            item-id="{0}" 
            data-href="/update-tx/{0}" 
            value="Sign" string="{1}"
            style='opacity: 0.8;padding: 2px 15px;'>
            """.format(obj.id, obj.tx_hash)
        button_sent = """
            <input type='submit' id='id_{}' 
            class='btn btn-outline-success btn-sm' 
            name='button_tx' 
            value='Sent'
            style='opacity: 0.8;padding: 2px 15px; 
            background-color: transparent; cursor: default;' disabled>
            """.format(obj.id)
        if(obj.is_sent):
            return format_html(button_sent)
        else:
            return format_html(button_init)

    transaction_actions.short_description = 'Transaction Actions'
    transaction_actions.allow_tags = True


@admin.register(HlorUser)
class HlorUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'wallet_address', 'balance', ]
    list_filter = ['id', 'user', 'wallet_address', 'balance', ]


@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(SingleModelAdmin):
    pass
