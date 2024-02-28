from django.urls import path
from rest_framework.routers import DefaultRouter

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from .views import *


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("courses", CourseViewSet, basename="courses")
router.register("course-summaries", CourseSummaryViewSet, basename="course-summaries")
router.register("sections", SectionViewSet, basename="sections")
router.register("modules", ModuleViewSet, basename="modules")
router.register("quizzes", QuizViewSet, basename="quizzes")
router.register("quizscores", QuizScoreViewSet, basename="quizscores")
router.register("resources", ResourceViewSet, basename="resources")
router.register("discussions", DiscussionViewSet, basename="discussions")
router.register("reviews", ReviewViewSet, basename="reviews")
router.register("comments", CommentViewSet, basename="comments")
router.register("replies", ReplyViewSet, basename="replies")
router.register("enrollments", EnrollmentViewSet, basename="enrollments")
router.register("payments", PaymentViewSet, basename="payments")
router.register("certifications", CertificationViewSet, basename="certifications")
router.register("progress", ProgressViewSet, basename="progresses")
router.register("change-user", ChangeUserDetailsViewSet, basename="change-user")


urlpatterns = [
    path("", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
]

urlpatterns += router.urls
