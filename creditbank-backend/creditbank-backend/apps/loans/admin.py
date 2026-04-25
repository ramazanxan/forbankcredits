from django.contrib import admin
from .models import Loan


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ['id', 'borrower', 'amount', 'interest_rate', 'term_months', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['borrower__email']
    ordering = ['-created_at']
