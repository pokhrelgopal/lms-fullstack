from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db import models

from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
import shortuuid


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **kwargs):
        if not email:
            raise ValueError(_("User must have an email address"))
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, email, password, **kwargs):
        user = self.create_user(email, password, **kwargs)
        user.is_staff = True
        user.is_superuser = True
        user.user_type = "admin"
        user.save(using=self.db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("admin", _("Admin")),
        ("instructor", _("Instructor")),
        ("student", _("Student")),
    )
    STATUS_CHOICES = (
        ("active", _("Active")),
        ("suspended", _("Suspended")),
        ("deleted", _("Deleted")),
    )
    id = models.CharField(
        _("ID"), primary_key=True, max_length=22, default=shortuuid.uuid, editable=False
    )
    email = models.EmailField(_("Email Address"), unique=True)
    full_name = models.CharField(_("Full Name"), max_length=100)
    role = models.CharField(
        _("Role"), max_length=10, choices=ROLE_CHOICES, default="student"
    )
    profile_image = models.ImageField(
        _("Profile Image"),
        upload_to="profile_image/",
        default="profile_image/default.png",
    )
    about = models.TextField(_("About"), blank=True, null=True)
    last_login = models.DateTimeField(_("Last Login"), blank=True, null=True)
    is_active = models.BooleanField(_("Is Active"), default=True)
    is_staff = models.BooleanField(_("Is Staff"), default=False)
    status = models.CharField(
        _("Status"), max_length=10, choices=STATUS_CHOICES, default="active"
    )
    created_at = models.DateTimeField(_("Created At"), default=timezone.now)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def can_change(self, request):
        return request.user == self

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["-created_at"]
