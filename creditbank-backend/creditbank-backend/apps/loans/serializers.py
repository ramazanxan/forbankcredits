from rest_framework import serializers
from .models import Loan


class LoanSerializer(serializers.ModelSerializer):
    borrower_email = serializers.EmailField(source='borrower.email', read_only=True)

    class Meta:
        model = Loan
        fields = [
            'id', 'borrower', 'borrower_email', 'amount', 'interest_rate',
            'term_months', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'borrower', 'borrower_email', 'created_at', 'updated_at']


class LoanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ['amount', 'interest_rate', 'term_months']

    def create(self, validated_data):
        validated_data['borrower'] = self.context['request'].user
        return super().create(validated_data)


class LoanStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ['status']


class ScheduleEntrySerializer(serializers.Serializer):
    month = serializers.IntegerField()
    payment = serializers.DecimalField(max_digits=12, decimal_places=2)
    principal = serializers.DecimalField(max_digits=12, decimal_places=2)
    interest = serializers.DecimalField(max_digits=12, decimal_places=2)
    balance = serializers.DecimalField(max_digits=12, decimal_places=2)
