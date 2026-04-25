from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.db.models import Sum, Count, Q

from apps.loans.models import Loan
from apps.payments.models import Payment


@extend_schema(tags=['Dashboard'])
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_staff_member:
            loans_qs = Loan.objects.all()
            payments_qs = Payment.objects.all()
        else:
            loans_qs = Loan.objects.filter(borrower=user)
            payments_qs = Payment.objects.filter(loan__borrower=user)

        loan_stats = loans_qs.aggregate(
            total_loans=Count('id'),
            total_amount=Sum('amount'),
            pending=Count('id', filter=Q(status='pending')),
            approved=Count('id', filter=Q(status='approved')),
            active=Count('id', filter=Q(status='active')),
            closed=Count('id', filter=Q(status='closed')),
            rejected=Count('id', filter=Q(status='rejected')),
            overdue=Count('id', filter=Q(status='overdue')),
        )

        payment_stats = payments_qs.aggregate(
            total_payments=Count('id'),
            total_paid=Sum('amount', filter=Q(status='success')),
            pending_payments=Count('id', filter=Q(status='pending')),
            successful_payments=Count('id', filter=Q(status='success')),
            failed_payments=Count('id', filter=Q(status='failed')),
        )

        return Response({
            'loans': loan_stats,
            'payments': payment_stats,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role,
            }
        })
