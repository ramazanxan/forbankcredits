from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .serializers import BatchInputSerializer
from .logic import run_batch


@extend_schema(tags=['Batch'])
class BatchRunView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=BatchInputSerializer)
    def post(self, request):
        serializer = BatchInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = run_batch(serializer.validated_data['rows'])
        return Response(result)
