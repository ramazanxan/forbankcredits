from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'loan', 'amount', 'status', 'method', 'created_at', 'paid_at']
        read_only_fields = ['id', 'created_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['loan', 'amount', 'method']

    def validate_loan(self, loan):
        user = self.context['request'].user
        if not user.is_staff_member and loan.borrower != user:
            raise serializers.ValidationError('You do not own this loan')
        return loan
