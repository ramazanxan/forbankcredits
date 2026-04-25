from django.urls import re_path
from apps.users.views import (
    LoginView, RegisterView, LogoutView, RefreshTokenView, MeView,
    ProfileView,
)
from apps.loans.views import LoanViewSet
from apps.payments.views import PaymentViewSet
from apps.dashboard.views import DashboardView
from apps.scoring.views import ScoringPredictView
from apps.batch.views import BatchRunView

loan_list = LoanViewSet.as_view({'get': 'list', 'post': 'create'})
loan_detail = LoanViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})
loan_schedule = LoanViewSet.as_view({'get': 'schedule'})

payment_list = PaymentViewSet.as_view({'get': 'list', 'post': 'create'})
payment_detail = PaymentViewSet.as_view({'get': 'retrieve'})

urlpatterns = [
    # Auth
    re_path(r'^auth/login/?$', LoginView.as_view(), name='auth-login'),
    re_path(r'^auth/register/?$', RegisterView.as_view(), name='auth-register'),
    re_path(r'^auth/logout/?$', LogoutView.as_view(), name='auth-logout'),
    re_path(r'^auth/refresh/?$', RefreshTokenView.as_view(), name='auth-refresh'),
    re_path(r'^auth/me/?$', MeView.as_view(), name='auth-me'),

    # Profile
    re_path(r'^profile/?$', ProfileView.as_view(), name='profile'),

    # Loans
    re_path(r'^loans/?$', loan_list, name='loan-list'),
    re_path(r'^loans/(?P<pk>[^/.]+)/schedule/?$', loan_schedule, name='loan-schedule'),
    re_path(r'^loans/(?P<pk>[^/.]+)/?$', loan_detail, name='loan-detail'),

    # Payments
    re_path(r'^payments/?$', payment_list, name='payment-list'),
    re_path(r'^payments/(?P<pk>[^/.]+)/?$', payment_detail, name='payment-detail'),

    # Dashboard
    re_path(r'^dashboard/?$', DashboardView.as_view(), name='dashboard'),

    # Scoring
    re_path(r'^scoring/predict/?$', ScoringPredictView.as_view(), name='scoring-predict'),

    # Batch
    re_path(r'^batch/run/?$', BatchRunView.as_view(), name='batch-run'),
]
