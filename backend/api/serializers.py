from user.serializers import UserSummarySerializer
from rest_framework import serializers
import time

from .models import *
from user.models import CustomUser
from utils.cert import generate_certificate


class CategorySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description", "created_at"]


class ChangeUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "email"]


class CourseSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    sections = serializers.SerializerMethodField(read_only=True)
    instructor = UserSummarySerializer(read_only=True)
    discussions = serializers.SerializerMethodField(read_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="instructor", write_only=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "instructor_id",
            "category_id",
            "name",
            "url_slug",
            "description",
            "level_of_difficulty",
            "price",
            "duration",
            "language",
            "publish_status",
            "thumbnail_image",
            "created_at",
            "updated_at",
            "instructor",
            "category",
            "sections",
            "discussions",
            "reviews",
        ]

    def get_sections(self, obj):
        return SectionSerializer(obj.sections.all(), many=True).data

    def get_discussions(self, obj):
        return DiscussionSerializer(obj.discussions.all(), many=True).data

    def get_reviews(self, obj):
        return ReviewSerializer(obj.reviews.all(), many=True).data


class CourseSummarySerializer(serializers.ModelSerializer):
    instructor = UserSummarySerializer(read_only=True)
    category = serializers.StringRelatedField()

    class Meta:
        model = Course
        fields = [
            "id",
            "name",
            "url_slug",
            "instructor",
            "category",
            "price",
            "thumbnail_image",
            "updated_at",
        ]

    def create(self, validated_data):
        raise serializers.ValidationError("Creation is not allowed.")

    def update(self, instance, validated_data):
        raise serializers.ValidationError("Updating is not allowed.")


class CategorySerializer(serializers.ModelSerializer):
    courses = CourseSummarySerializer(many=True, read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="created_by", write_only=True
    )

    class Meta:
        model = Category
        fields = [
            "id",
            "user_id",
            "name",
            "description",
            "created_at",
            "courses",
        ]


class SectionSerializer(serializers.ModelSerializer):
    course = CourseSummarySerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    modules = serializers.SerializerMethodField()
    quizzes = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = [
            "id",
            "course_id",
            "name",
            "description",
            "course",
            "order",
            "created_at",
            "updated_at",
            "modules",
            "quizzes",
        ]

    def get_modules(self, obj):
        return ModuleSerializer(obj.modules.all(), many=True).data

    def get_quizzes(self, obj):
        return QuizSerializer(obj.quizzes.all(), many=True).data


class SectionSummarySerializer(serializers.ModelSerializer):
    # course = CourseSummarySerializer(read_only=True)
    class Meta:
        model = Section
        fields = ["id", "name", "order", "course"]


class ModuleSerializer(serializers.ModelSerializer):
    section = SectionSummarySerializer(read_only=True)
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )
    resources = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            "id",
            "section_id",
            "name",
            "description",
            "order",
            "video_url",
            "thumbnail_image",
            "duration",
            "is_free",
            "created_at",
            "updated_at",
            "section",
            "resources",
        ]

    def get_resources(self, obj):
        return ResourceSerializer(obj.resources.all(), many=True).data


class QuizSerializer(serializers.ModelSerializer):
    section = SectionSummarySerializer(read_only=True)
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )

    class Meta:
        model = Quiz
        fields = [
            "id",
            "section_id",
            "question",
            "order",
            "option_1",
            "option_2",
            "option_3",
            "option_4",
            "answer",
            "section",
        ]


class QuizScoreSerializer(serializers.ModelSerializer):
    section = SectionSummarySerializer(read_only=True)
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )
    user = UserSummarySerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )

    class Meta:
        model = QuizScore
        fields = [
            "id",
            "section_id",
            "user_id",
            "user",
            "section",
            "score",
            "created_at",
            "updated_at",
        ]


class ResourceSerializer(serializers.ModelSerializer):
    module_id = serializers.PrimaryKeyRelatedField(
        queryset=Module.objects.all(), source="module", write_only=True
    )

    class Meta:
        model = Resource
        fields = [
            "id",
            "module_id",
            "title",
            "description",
            "file",
            "external_link",
            "created_at",
            "updated_at",
        ]


class DiscussionSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Discussion
        fields = [
            "id",
            "course_id",
            "created_at",
            "updated_at",
            "comments",
        ]

    def get_comments(self, obj):
        return CommentSerializer(obj.comments.all(), many=True).data


class ReviewSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "course_id",
            "user_id",
            "user",
            "rating",
            "review",
            "created_at",
            "updated_at",
        ]


class CommentSerializer(serializers.ModelSerializer):
    discussion_id = serializers.PrimaryKeyRelatedField(
        queryset=Discussion.objects.all(), source="discussion", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )
    user = UserSummarySerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "discussion_id",
            "user_id",
            "user",
            "comment",
            "created_at",
            "updated_at",
            "replies",
        ]

    def get_replies(self, obj):
        return ReplySerializer(obj.replies.all(), many=True).data


class ReplySerializer(serializers.ModelSerializer):
    comment_id = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(), source="comment", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Reply
        fields = [
            "id",
            "comment_id",
            "user_id",
            "user",
            "reply",
            "created_at",
            "updated_at",
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )
    course = CourseSummarySerializer(read_only=True)
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "course_id",
            "user_id",
            "user",
            "course",
            "created_at",
            "updated_at",
        ]


class PaymentSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )
    course = CourseSummarySerializer(read_only=True)
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "course_id",
            "user_id",
            "user",
            "course",
            "amount",
            "pidx",
            "status",
            "created_at",
            "updated_at",
        ]

    def save(self, **kwargs):
        payment = super().save(**kwargs)
        if payment.status == "Success":
            course = payment.course
            Enrollment.objects.create(course=course, user=payment.user)
        return payment


class CertificationSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )
    course = CourseSummarySerializer(read_only=True)
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Certification
        fields = [
            "id",
            "course",
            "course_id",
            "user",
            "certificate",
            "user_id",
            "created_at",
            "updated_at",
        ]

    def save(self, **kwargs):
        certification = super().save(**kwargs)
        course = certification.course
        user = certification.user
        certificate = generate_certificate(
            student_name=user.full_name,
            instructor_signature=course.instructor.full_name,
            instructor_name=course.instructor.full_name,
            course_name=course.name,
        )

        certification.certificate = certificate
        certification.save()
        return certification


class ProgressSerializer(serializers.ModelSerializer):
    module_id = serializers.PrimaryKeyRelatedField(
        queryset=Module.objects.all(), source="module", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source="user", write_only=True
    )
    module = ModuleSerializer(read_only=True)
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Progress
        fields = [
            "id",
            "module_id",
            "user_id",
            "user",
            "module",
            "completed",
            "created_at",
            "updated_at",
        ]
