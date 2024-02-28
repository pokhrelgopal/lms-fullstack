from django.utils.text import slugify
from user.models import CustomUser
from django.db import models
import shortuuid


def default_thumbnail_image():
    return "course_thumbnails/default.jpg"


class Category(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="created_categories",
    )

    def __str__(self):
        return self.name

    def can_change(self, user):
        return user == self.created_by

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["-created_at"]


class Course(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    name = models.CharField(max_length=100, unique=True)
    url_slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
    description = models.TextField(null=True, blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="courses",
    )
    instructor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="created_courses",
    )
    level_of_difficulty = models.CharField(max_length=100, null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)
    duration = models.CharField(null=True, blank=True, max_length=100)
    language = models.CharField(max_length=100, null=True, blank=True)
    publish_status = models.BooleanField(default=False)
    thumbnail_image = models.ImageField(
        upload_to="course_thumbnails",
        blank=True,
        null=True,
        default=default_thumbnail_image,
    )
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.url_slug = slugify(self.name)
        super(Course, self).save(*args, **kwargs)

    def can_change(self, user):
        return user == self.instructor

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Courses"
        ordering = ["-created_at"]


class Section(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="sections"
    )
    order = models.PositiveIntegerField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def can_change(self, user):
        return user == self.course.instructor

    def __str__(self):
        return f"{self.order} - {self.course.name} - {self.name}"

    class Meta:
        verbose_name_plural = "Sections"
        ordering = ["order"]
        unique_together = ["course", "name"]


class Module(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    order = models.PositiveIntegerField()
    video_url = models.FileField(upload_to="course_videos", blank=True, null=True)
    thumbnail_image = models.ImageField(
        upload_to="module_thumbnails",
        blank=True,
        null=True,
        default=default_thumbnail_image,
    )
    duration = models.CharField(null=True, blank=True, max_length=100)
    is_free = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="modules"
    )

    def __str__(self):
        return f"{self.order} - {self.name} - {self.section.name}"

    def can_change(self, user):
        return user == self.section.course.instructor

    class Meta:
        verbose_name_plural = "Modules"
        ordering = ["order"]
        unique_together = ["section", "name"]


class Quiz(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="quizzes", null=True, blank=True
    )
    question = models.TextField()
    order = models.PositiveIntegerField(default=0)
    option_1 = models.CharField(max_length=200)
    option_2 = models.CharField(max_length=200)
    option_3 = models.CharField(max_length=200)
    option_4 = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.section.course.name} - {self.section.name} - Quiz : {self.order}"

    def can_change(self, user):
        return user == self.section.course.instructor

    class Meta:
        verbose_name_plural = "Quizzes"
        ordering = ["order"]


class QuizScore(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="quiz_scores"
    )
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="quiz_scores"
    )
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.section.course.name} - {self.section.name} - Quiz Score"

    class Meta:
        verbose_name_plural = "Quiz Scores"
        ordering = ["-created_at"]
        unique_together = ["user", "section"]


class Resource(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="resources"
    )
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to="course_resources", null=True, blank=True)
    external_link = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.module.section.course.name} - {self.module.section.name} - {self.module.name} - {self.title}"

    def can_change(self, user):
        return user == self.module.section.course.instructor

    class Meta:
        verbose_name_plural = "Resources"
        ordering = ["title"]


class Discussion(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="discussions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.name} - Discussion"

    class Meta:
        verbose_name_plural = "Discussions"
        ordering = ["-created_at"]
        unique_together = ["course"]

    def can_change(self, user):
        return user == self.course.instructor


class Review(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="reviews"
    )
    rating = models.FloatField()
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.name} - {self.user.email} - Review"

    class Meta:
        verbose_name_plural = "Reviews"
        ordering = ["-created_at"]
        unique_together = ["course", "user"]


class Comment(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    discussion = models.ForeignKey(
        Discussion, on_delete=models.CASCADE, related_name="comments"
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="comments"
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def can_change(self, user):
        return user == self.user or user == self.discussion.course.instructor

    def __str__(self):
        return f"{self.discussion.course.name} - {self.discussion.id} - {self.user.email} - Comment"

    class Meta:
        verbose_name_plural = "Comments"
        ordering = ["-created_at"]


class Reply(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name="replies"
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="replies"
    )
    reply = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def can_change(self, user):
        return user == self.user or user == self.comment.user

    def __str__(self):
        return f"{self.comment.discussion.course.name} - {self.comment.discussion.id} - {self.comment.id} - {self.user.email} - Reply"

    class Meta:
        verbose_name_plural = "Replies"
        ordering = ["created_at"]


class Payment(models.Model):
    STATUS_CHOICES = [
        ("Initiated", "Initiated"),
        ("Pending", "Pending"),
        ("Failed", "Failed"),
        ("Success", "Success"),
    ]

    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    pidx = models.CharField(max_length=100)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="payments"
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="payments"
    )
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="Initiated", blank=True
    )

    def __str__(self):
        return f"{self.course.name} - {self.user.email} - Payment"

    class Meta:
        verbose_name_plural = "Payments"
        ordering = ["-created_at"]
        unique_together = ["course", "user"]


class Enrollment(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="enrollments"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.name} - {self.user.email} - Enrollment"

    class Meta:
        verbose_name_plural = "Enrollments"
        ordering = ["-created_at"]
        unique_together = ["course", "user"]


class Progress(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="progresses"
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="progresses"
    )
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def can_change(self, user):
        return user == self.user

    def __str__(self):
        return f"{self.module.section.course.name} - {self.module.section.name} - {self.module.name} - Progress of {self.user.full_name}"

    class Meta:
        verbose_name_plural = "Progresses"
        ordering = ["-created_at"]
        unique_together = ["module", "user"]


class Certification(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, default=shortuuid.uuid, editable=False
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="certifications"
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="certifications"
    )
    certificate = models.FileField(upload_to="certificates", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.name} - {self.user.email} - Certification"

    class Meta:
        verbose_name_plural = "Certifications"
        ordering = ["-created_at"]
        unique_together = ["course", "user"]
