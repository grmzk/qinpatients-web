class ErrorDb:
    def __init__(self):
        self._error_access: bool = False

    @property
    def error_access(self):
        return self._error_access

    @error_access.setter
    def error_access(self, state: bool):
        self._error_access = state


error_db = ErrorDb()
