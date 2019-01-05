from django.urls import path

from . import views

urlpatterns = [
	path('update-tx/<int:pk>', views.tx_update, name="tx-update"),
	path('create-withdraw/', views.create_withdraw, name="create-withdraw"),
	path('list-tx/', views.TransactionListView.as_view(), name="tx-list"),
	path('profile/', views.profile, name='profile'),
]
