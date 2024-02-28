# your_app/tests/test_views.py
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser
from .serializers import UserSummarySerializer


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "testpassword",
        }
        self.user = CustomUser.objects.create_user(**self.user_data)

    def test_token_obtain_pair_endpoint(self):
        url = "http://127.0.0.1:8000/user/token/"
        response = self.client.post(
            url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_user_summary_serializer_create(self):
        data = {
            "email": "newuser@example.com",
            "full_name": "New User",
            "password": "newpassword",
            "role": "instructor",
        }
        serializer = UserSummarySerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        self.assertEqual(user.email, data["email"])
        self.assertEqual(user.full_name, data["full_name"])
        self.assertEqual(user.role, data["role"])

    def test_user_summary_serializer_update(self):
        data = {
            "full_name": "Updated Name",
            "email": "updated@example.com",
            "password": "updatedpassword",
        }
        serializer = UserSummarySerializer(instance=self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()

        self.assertEqual(updated_user.full_name, data["full_name"])
        self.assertEqual(updated_user.email, data["email"])
        self.assertTrue(updated_user.check_password(data["password"]))

    def test_last_login_updated(self):
        url = "http://127.0.0.1:8000/user/token/"
        response = self.client.post(
            url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.last_login)
