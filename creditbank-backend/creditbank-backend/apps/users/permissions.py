from rest_framework.permissions import BasePermission


class IsStaffMember(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('moderator', 'admin_it', 'admin_bank')


class IsClientOrStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
