LOCAL_AUTHZ_MODELS = {
	"serviceuser",
	"localrole",
	"localpermission",
	"localrolepermission",
	"localuserrole",
}


class UsersRouter:
	local_db = "local_authz"

	def db_for_read(self, model, **hints):
		if model._meta.app_label == "users" and model._meta.model_name in LOCAL_AUTHZ_MODELS:
			return self.local_db
		return None

	def db_for_write(self, model, **hints):
		if model._meta.app_label == "users" and model._meta.model_name in LOCAL_AUTHZ_MODELS:
			return self.local_db
		return None

	def allow_relation(self, obj1, obj2, **hints):
		if (
			obj1._meta.app_label == "users"
			and obj1._meta.model_name in LOCAL_AUTHZ_MODELS
			and obj2._meta.app_label == "users"
			and obj2._meta.model_name in LOCAL_AUTHZ_MODELS
		):
			return True
		return None

	def allow_migrate(self, db, app_label, model_name=None, **hints):
		if app_label != "users" or model_name is None:
			return None
		if model_name in LOCAL_AUTHZ_MODELS:
			return db == self.local_db
		return db == "default"
