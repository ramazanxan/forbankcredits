from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import Loan
from .serializers import LoanSerializer, LoanCreateSerializer, LoanStatusUpdateSerializer
from .filters import LoanFilter
from apps.users.permissions import IsStaffMember


class LoanViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = LoanFilter
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff_member:
            return Loan.objects.all().select_related('borrower')
        return Loan.objects.filter(borrower=user).select_related('borrower')

    def get_serializer_class(self):
        if self.action == 'create':
            return LoanCreateSerializer
        if self.action == 'partial_update':
            user = self.request.user
            if user.is_staff_member:
                return LoanStatusUpdateSerializer
            return LoanCreateSerializer
        return LoanSerializer

    @extend_schema(tags=['Loans'], responses={200: LoanSerializer(many=True)})
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = LoanSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = LoanSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Loans'], request=LoanCreateSerializer, responses={201: LoanSerializer})
    def create(self, request):
        if request.user.is_staff_member:
            return Response({'detail': 'Staff cannot create loans'}, status=status.HTTP_403_FORBIDDEN)
        serializer = LoanCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        loan = serializer.save()
        return Response(LoanSerializer(loan).data, status=status.HTTP_201_CREATED)

    @extend_schema(tags=['Loans'], responses={200: LoanSerializer})
    def retrieve(self, request, pk=None):
        loan = self.get_object()
        return Response(LoanSerializer(loan).data)

    @extend_schema(tags=['Loans'], responses={200: LoanSerializer})
    def partial_update(self, request, pk=None):
        loan = self.get_object()
        user = request.user
        if not user.is_staff_member and loan.borrower != user:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        if user.is_staff_member:
            serializer = LoanStatusUpdateSerializer(loan, data=request.data, partial=True)
        else:
            serializer = LoanCreateSerializer(loan, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        loan = serializer.save()
        return Response(LoanSerializer(loan).data)

    def get_object(self):
        from django.shortcuts import get_object_or_404
        queryset = self.get_queryset()
        pk = self.kwargs.get('pk')
        obj = get_object_or_404(queryset, pk=pk)
        self.check_object_permissions(self.request, obj)
        return obj

    @extend_schema(tags=['Loans'])
    def schedule(self, request, pk=None):
        loan = self.get_object()
        amount = float(loan.amount)
        rate = float(loan.interest_rate) / 100 / 12
        term = loan.term_months

        if rate == 0:
            monthly_payment = amount / term
        else:
            monthly_payment = amount * rate * (1 + rate) ** term / ((1 + rate) ** term - 1)

        schedule = []
        balance = amount
        for month in range(1, term + 1):
            interest = balance * rate
            principal = monthly_payment - interest
            balance -= principal
            if balance < 0:
                balance = 0
            schedule.append({
                'month': month,
                'payment': round(monthly_payment, 2),
                'principal': round(principal, 2),
                'interest': round(interest, 2),
                'balance': round(balance, 2),
            })

        return Response({
            'loan_id': loan.pk,
            'monthly_payment': round(monthly_payment, 2),
            'total_payment': round(monthly_payment * term, 2),
            'total_overpayment': round(monthly_payment * term - amount, 2),
            'schedule': schedule,
        })
