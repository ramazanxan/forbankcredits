from rest_framework import serializers
from apps.scoring.serializers import ScoringInputSerializer


class BatchRowSerializer(ScoringInputSerializer):
    interest_rate = serializers.FloatField(min_value=0)
    label = serializers.IntegerField(min_value=0, max_value=1, required=False, allow_null=True)


class BatchInputSerializer(serializers.Serializer):
    rows = BatchRowSerializer(many=True)
