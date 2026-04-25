import django_filters
from .models import Payment


class PaymentFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Payment.STATUS_CHOICES)
    loan = django_filters.NumberFilter(field_name='loan_id')

    class Meta:
        model = Payment
        fields = ['status', 'loan']
