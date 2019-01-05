import base64
import hashlib

import datetime
import uuid

import binascii

try:
    from django.urls import reverse
except ImportError:
    from django.core.urlresolvers import reverse
from django.utils.encoding import force_bytes
from django.views.generic import TemplateView, FormView, UpdateView, ListView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from .models import Transaction

from django.shortcuts import render
from django.db.models import Sum, Avg
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.http.response import HttpResponse
from django.contrib.auth.models import User
# from django.contrib.gis.geoip import GeoIP
from django.http import Http404, JsonResponse
from decimal import Decimal

from .models import HlorUser
from .forms import TransactionForm

from datetime import datetime, timedelta
import json
import time
import requests


class TransactionListView(ListView):
    model = Transaction
    template_name = 'trezor/transaction_list.html'

    def get_context_data(self, **kwargs):
        context = super(TransactionListView, self).get_context_data(**kwargs)
        transactions = Transaction.objects.all()
        context = {
            'transactions': transactions,
            'opts': Transaction._meta,
        }
        return context


def tx_update(request, pk):
    item = get_object_or_404(Transaction, pk=pk) #test
    item.status = True
    item.save()
    # return Response(response, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse({
        'new_status': item.status,
        'id': item.id,
    }) #test, add success and fail http responses


@login_required(login_url='/login')
def profile(request):
    username = request.user.username
    user = User.objects.get(username=username)
    withdraws = Transaction.objects.filter(user=user)
    balance = user.hlor.balance
    data = {
        'balance': balance, #current Hlor balance
        'withdraws': withdraws, #current user transactions

    }

    return render(request, 'profile/index.html', data)


def create_withdraw(request):
    if request.method == 'POST':
        withdraw_amount = request.POST.get('amount')
        response_data = {}
        user = request.user
        user_obj = User.objects.get(username=user.username)
        wallet = user_obj.hlor.wallet_address
        balance = user_obj.hlor.balance
        new_balance_amount = balance - Decimal(withdraw_amount)
        if new_balance_amount >= 0:
            withdraw = Transaction.objects.create(
                amount=withdraw_amount,
                user=request.user,
                wallet_address=wallet)

            user_obj.hlor.balance = new_balance_amount
            user_obj.hlor.save()

            response_data = {
                'id': withdraw.id,
                'amount': withdraw.amount,
                'status': withdraw.status,
                'tx_hash': withdraw.tx_hash,
                'created_at': withdraw.created_at.strftime("%b. %-d, %Y"),
                'wallet_address': withdraw.wallet_address,
            }
            return JsonResponse(response_data)
        else:
            return JsonResponse({
                    'error': 'Current amount more than balance'
                })
