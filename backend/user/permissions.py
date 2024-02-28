from rest_framework.permissions import BasePermission, SAFE_METHODS

ALLOWED_METHODS = ("GET", "HEAD", "OPTIONS", "POST")


class UserPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in ALLOWED_METHODS:
            return True

        return request.user and request.user.is_staff


class CustomPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS or request.user.is_staff:
            return True

        if hasattr(obj, "can_change") and callable(getattr(obj, "can_change")):
            return obj.can_change(request.user)

        return False


class IsAuthenticatedOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and (request.user.role == "instructor" or request.user.is_staff)
        )
