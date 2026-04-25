from rest_framework import serializers


class ScoringInputSerializer(serializers.Serializer):
    age = serializers.IntegerField(min_value=18, max_value=100)
    income = serializers.FloatField(min_value=0)
    loan_amount = serializers.FloatField(min_value=0)
    term_months = serializers.IntegerField(min_value=1)
    credit_history_length = serializers.FloatField(min_value=0)
    num_open_loans = serializers.IntegerField(min_value=0)
    employment_years = serializers.FloatField(min_value=0)
    has_mortgage = serializers.BooleanField()
    has_car_loan = serializers.BooleanField()
    region_risk = serializers.FloatField(min_value=0, max_value=1)
    interest_rate = serializers.FloatField(min_value=0, default=12.0)


class ScoringOutputSerializer(serializers.Serializer):
    approved = serializers.BooleanField()
    probability_of_default = serializers.FloatField()
    score = serializers.IntegerField()
    risk_level = serializers.CharField()
    monthly_payment = serializers.FloatField()
    total_overpayment = serializers.FloatField()
    factorKeys = serializers.ListField(child=serializers.CharField())
    recommendationKeys = serializers.ListField(child=serializers.CharField())
