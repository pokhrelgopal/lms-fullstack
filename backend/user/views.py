from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSummarySerializer
from .models import CustomUser
from rest_framework.decorators import action
from api.models import Course


class UserViewSet(ModelViewSet):
    serializer_class = UserSummarySerializer
    queryset = CustomUser.objects.all()

    def get_queryset(self):
        role = self.request.query_params.get("role", None)
        instructor_id = self.request.query_params.get("instructor_id", None)

        if instructor_id is not None:
            return CustomUser.objects.filter(id=instructor_id)

        if role == "instructor":
            return CustomUser.objects.filter(role="instructor")
        elif role == "student":
            return CustomUser.objects.filter(role="student")

        user_id = self.request.user.id
        if not user_id:
            return CustomUser.objects.none()

        if self.request.user.is_superuser or self.request.user.role == "admin":
            if self.request.query_params.get("all") == "true":
                return CustomUser.objects.all()

        return CustomUser.objects.filter(id=user_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if queryset.exists():
            serializer = self.get_serializer(queryset, many=True)
            if len(queryset) == 1 and not self.request.query_params.get("role"):
                return Response(serializer.data[0])
            return Response(serializer.data)
        else:
            if len(queryset) == 0:
                return Response(
                    {"detail": "No user found"}, status=status.HTTP_204_NO_CONTENT
                )
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"])
    def get_info(self, request):
        if not request.user.id or not (
            request.user.is_superuser or request.user.role == "admin"
        ):
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        student_count = CustomUser.objects.filter(role="student").count()
        instructor_count = CustomUser.objects.filter(role="instructor").count()
        published_courses_count = Course.objects.filter(publish_status=True).count()
        unpublished_courses_count = Course.objects.filter(publish_status=False).count()

        return Response(
            {
                "student_count": student_count,
                "instructor_count": instructor_count,
                "published_courses_count": published_courses_count,
                "unpublished_courses_count": unpublished_courses_count,
            }
        )

    # @action(detail=False, methods=["get"], permission_classes=[CustomPermission])
    # def me(self, request):
    #     serializer = self.get_serializer(self.request.user)
    #     return Response(serializer.data)
