from drf_spectacular.extensions import OpenApiAuthenticationExtension


class CompanyJWTAuthenticationScheme(OpenApiAuthenticationExtension):
	target_class = "apps.users.authentication.CompanyJWTAuthentication"
	name = "BearerAuth"

	def get_security_definition(self, auto_schema):
		return {
			"type": "http",
			"scheme": "bearer",
			"bearerFormat": "JWT",
		}
