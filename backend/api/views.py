from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum


from .serializers import *
from .models import *
from user.permissions import (
    CustomPermission,
    IsAuthenticated,
    IsInstructor,
    IsAuthenticatedOrReadOnly,
)


class CategoryViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticatedOrReadOnly]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("q", None)
        if search is not None:
            queryset = queryset.filter(Q(name__icontains=search))
        return queryset


class CourseSummaryViewSet(ModelViewSet):
    queryset = Course.objects.filter(publish_status=True)
    serializer_class = CourseSummarySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        queryset = super().get_queryset().prefetch_related("instructor")
        category = self.request.query_params.get("category", None)
        search = self.request.query_params.get("q", None)
        my_courses = self.request.query_params.get("my_courses", None)
        instructor_id = self.request.query_params.get("instructor_id", None)
        if instructor_id is not None:
            instructor = CustomUser.objects.get(id=instructor_id)
            queryset = queryset.filter(instructor=instructor)
        if my_courses is not None:
            if self.request.user.role == "instructor":
                queryset = queryset.filter(instructor=self.request.user)

        if search is not None:
            queryset = queryset.filter(Q(name__icontains=search))
        if category is not None:
            queryset = queryset.filter(category__name__icontains=category)

        if category is None and search is None and my_courses is None:
            queryset = queryset.filter(publish_status=True)

        return queryset


class CourseViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated, IsInstructor]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    lookup_field = "url_slug"

    def get_queryset(self):
        queryset = super().get_queryset().prefetch_related("instructor")
        category = self.request.query_params.get("category", None)
        tag = self.request.query_params.get("tag", None)
        search = self.request.query_params.get("q", None)
        my_courses = self.request.query_params.get("my_courses", None)
        if my_courses is not None:
            if self.request.user.role == "instructor":
                queryset = queryset.filter(instructor=self.request.user)

        if search is not None:
            queryset = queryset.filter(Q(name__icontains=search))
        if category is not None:
            queryset = queryset.filter(category__name__icontains=category)
        if tag is not None:
            queryset = queryset.filter(tags__name__icontains=tag)
        return queryset

    @action(detail=False, methods=["get"])
    def get_modules_count(self, request):
        course_id = self.request.query_params.get("course_id", None)
        if not course_id:
            return Response({"error": "Course ID is required"}, status=400)
        try:
            modules_count = Module.objects.filter(section__course__id=course_id).count()
            return Response({"modules_count": modules_count})
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

    @action(detail=False, methods=["get"])
    def get_detail(self, request, *args, **kwargs):
        user = self.request.user
        if user.role != "instructor":
            return Response({"error": "You are not allowed to perform this action"})

        courses = Course.objects.filter(instructor=user)
        total_courses = courses.count()
        total_student_count = Enrollment.objects.filter(course__in=courses).count()
        total_earnings = Payment.objects.filter(course__in=courses).aggregate(
            total_earnings=Sum("amount")
        )
        return Response(
            {
                "total_courses": total_courses,
                "total_student_count": total_student_count,
                "total_earnings": total_earnings["total_earnings"],
            }
        )


class SectionViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Section.objects.all()
    serializer_class = SectionSerializer


class ModuleViewSet(ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

    def get_permissions(self):
        slug = self.request.query_params.get("slug", None)
        is_free = self.request.query_params.get("is_free", None)
        if is_free == "true" and slug is not None:
            return []
        else:
            return [CustomPermission(), IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        slug = self.request.query_params.get("slug", None)
        is_free = self.request.query_params.get("is_free", None)
        if is_free == "true" and slug is not None:
            queryset = queryset.filter(section__course__url_slug=slug, is_free=True)
        if slug is not None:
            queryset = queryset.filter(section__course__url_slug=slug)

        return queryset


class QuizViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def get_queryset(self):
        section_id = self.request.query_params.get("section_id", None)
        if section_id is not None:
            return Quiz.objects.filter(section__id=section_id)
        return super().get_queryset()


class QuizScoreViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = QuizScore.objects.all()
    serializer_class = QuizScoreSerializer

    @action(detail=False, methods=["get"])
    def is_completed(self, request):
        user = self.request.user
        section_id = self.request.query_params.get("section_id", None)
        if not section_id:
            return Response({"error": "Section ID is required"}, status=400)

        try:
            quiz_score = QuizScore.objects.get(user=user, section__id=section_id)
            return Response(
                {
                    "completed": True,
                    "score": quiz_score.score,
                    "total_questions": quiz_score.section.quizzes.count(),
                }
            )
        except QuizScore.DoesNotExist:
            return Response({"completed": False})

    @action(detail=False, methods=["get"])
    def get_all_scores(self, request):
        section_id = self.request.query_params.get("section_id", None)
        if not section_id:
            return Response({"error": "Section ID is required"}, status=400)

        try:
            quiz_score = QuizScore.objects.filter(section__id=section_id)
            return Response(
                {
                    "completed": True,
                    "scores": QuizScoreSerializer(quiz_score, many=True).data,
                }
            )
        except QuizScore.DoesNotExist:
            return Response({"completed": False})


class ResourceViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer


class DiscussionViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer


class ReviewViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class CommentViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class ReplyViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer


class EnrollmentViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset().prefetch_related("user", "course")
        # if user.role == "instructor":
        #     queryset = queryset.filter(course__instructor=user)
        # else:
        queryset = queryset.filter(user=user)
        return queryset

    @action(detail=False, methods=["get"])
    def is_enrolled(self, request):
        user = self.request.user
        course_id = self.request.query_params.get("course_id", None)

        if not course_id:
            return Response({"error": "Course ID is required"}, status=400)

        try:
            enrollment = Enrollment.objects.get(user=user, course__id=course_id)
            return Response({"enrolled": True})
        except Enrollment.DoesNotExist:
            return Response({"enrolled": False})


class PaymentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class CertificationViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get("course_id", None)
        user = self.request.user
        if course_id is not None:
            return Certification.objects.filter(user=user, course__id=course_id)

        return Certification.objects.filter(user=user)


class ProgressViewSet(ModelViewSet):
    permission_classes = [CustomPermission, IsAuthenticated]
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

    @action(detail=False, methods=["get"])
    def modules_completed_in_course(self, request):
        user = self.request.user
        course_id = self.request.query_params.get("course_id", None)

        if not course_id:
            return Response({"error": "Course ID is required"}, status=400)

        try:
            completed_modules_count = Progress.objects.filter(
                user=user, module__section__course__id=course_id, completed=True
            ).count()

            total_modules_count = Module.objects.filter(
                section__course__id=course_id
            ).count()

            return Response(
                {
                    "completed_modules": completed_modules_count,
                    "total_modules": total_modules_count,
                }
            )
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

    @action(detail=False, methods=["get"])
    def check_module_completion(self, request):
        user = self.request.user
        module_id = self.request.query_params.get("module_id", None)
        if not module_id:
            return Response({"error": "Module ID is required"}, status=400)
        try:
            progress = Progress.objects.get(user=user, module__id=module_id)
            if progress.completed:
                return Response({"completed": progress.completed})
        except Progress.DoesNotExist:
            return Response({"completed": False})

        return Response({"completed": False})


class ChangeUserDetailsViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = ChangeUserDetailsSerializer

    def get_queryset(self):
        if self.request.user.role != "admin" and not self.request.user.is_superuser:
            return CustomUser.objects.none()

        return CustomUser.objects.all()
