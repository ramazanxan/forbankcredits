from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404

from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer
from .filters import PaymentFilter


class PaymentViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = PaymentFilter
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff_member:
            return Payment.objects.all().select_related('loan', 'loan__borrower')
        return Payment.objects.filter(loan__borrower=user).select_related('loan', 'loan__borrower')

    @extend_schema(tags=['Payments'], responses={200: PaymentSerializer(many=True)})
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PaymentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(PaymentSerializer(queryset, many=True).data)

    @extend_schema(tags=['Payments'], request=PaymentCreateSerializer, responses={201: PaymentSerializer})
    def create(self, request):
        serializer = PaymentCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

    @extend_schema(tags=['Payments'], responses={200: PaymentSerializer})
    def retrieve(self, request, pk=None):
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        return Response(PaymentSerializer(obj).data)
