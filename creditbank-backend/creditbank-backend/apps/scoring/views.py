from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .serializers import ScoringInputSerializer, ScoringOutputSerializer
from .logic import compute_score


@extend_schema(tags=['Scoring'])
class ScoringPredictView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=ScoringInputSerializer, responses={200: ScoringOutputSerializer})
    def post(self, request):
        serializer = ScoringInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = compute_score(serializer.validated_data)
        return Response(result)
