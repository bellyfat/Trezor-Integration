import base64
import hashlib
import re 

import datetime
import uuid

import binascii
from web3 import Web3, HTTPProvider
from django.core.paginator import Paginator

try:
    from django.urls import reverse
except ImportError:
    from django.core.urlresolvers import reverse
from django.utils.encoding import force_bytes
from django.views.generic import TemplateView, FormView, UpdateView, ListView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from django.shortcuts import render
from django.db.models import Sum, Avg
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.http.response import HttpResponse
from django.contrib.auth.models import User
from django.http import Http404, JsonResponse
from decimal import Decimal

from .models import HlorUser, SiteConfiguration, Withdraw

# from datetime import datetime, timedelta
# import json
# import time
# import requests

web3 = Web3(HTTPProvider('https://rinkeby.infura.io/TraaTD0M8AKlhMRoRNp8'))

def get_error_msg(msg):
    return JsonResponse({'error': msg})


class WithdrawListView(ListView):
    model = Withdraw
    template_name = 'trezor/withdraw_list.html'

    def get_context_data(self, **kwargs):
        context = super(WithdrawListView, self).get_context_data(**kwargs)
        transactions = Withdraw.objects.all()
        context = {
            'transactions': transactions,
            'opts': Withdraw._meta,
        }
        return context


def tx_update(request, pk):
    item = get_object_or_404(Withdraw, pk=pk) #test
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
    withdraw_list = Withdraw.objects.filter(user=user)

    paginator = Paginator(withdraw_list, 25) # Show 25 contacts per page
    page = request.GET.get('page')
    withdraws = paginator.get_page(page)

    balance = user.hlor.balance
    data = {
        'balance': balance,
        'withdraws': withdraws,
    }

    return render(request, 'profile/index.html', data)

@login_required(login_url='/login')
def create_withdraw(request):
    if request.method == 'POST':
        str_amount = request.POST.get('amount')

        regex = re.compile('^\d+\.?\d{0,18}$')
        if regex.search(str_amount) == None:
            msg = 'Withdraw is not possible, withdraw amount is incorrect.'
            return get_error_msg(msg)

        withdraw_amount = float(str_amount)

        min_amount = SiteConfiguration.objects.first().min_withdraw_amount

        if withdraw_amount <= min_amount:
            msg = 'Withdraw amount must be more or equal than {}.'.format(min_amount)
            return get_error_msg(msg)

        if withdraw_amount < 0:
            msg = 'Withdraw amount cannot be negative, withdraw is not possible'
            return get_error_msg(msg)

        user = request.user
        user_obj = User.objects.get(username=user.username)
        wallet = user_obj.hlor.wallet_address
        balance = float(user_obj.hlor.balance)

        if not web3.isAddress(wallet):
            msg = 'Wrong wallet addres.'
            return get_error_msg(msg)

        if balance == 0:
            msg = 'Balance is 0, withdraw is not possible.'
            return get_error_msg(msg)

        if withdraw_amount > balance:
            msg = 'Withdraw amount must be less or equal than balance'
            return get_error_msg(msg)

        new_balance_amount = balance - withdraw_amount
        if new_balance_amount < 0:
            msg = 'Withdraw amount must be less or equal than balance.'
            return get_error_msg(msg)
        withdraw = Withdraw.objects.create(
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
            

            
