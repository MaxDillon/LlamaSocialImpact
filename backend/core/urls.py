from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from checkups.views import CheckupListView, PatientViewSet, CheckupViewSet, ModuleViewSet
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


router = DefaultRouter(trailing_slash=False)  # Add this parameter

router.register(r"patients", PatientViewSet, basename="patient")
router.register(r"checkups", CheckupViewSet, basename="checkup")
router.register(r"modules", ModuleViewSet, basename="module")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Optional UI:
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),    
    path('checkups/', CheckupListView.as_view(), name='checkup-list'),

]
