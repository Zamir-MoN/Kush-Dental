class DomainException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400, details: str = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)

class NotFoundException(DomainException):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            code="NOT_FOUND",
            message=f"{resource} not found",
            status_code=404,
            details=f"Resource {resource} with identifier {identifier} could not be found"
        )

class ConflictException(DomainException):
    def __init__(self, message: str, details: str = None):
        super().__init__(
            code="CONFLICT",
            message=message,
            status_code=409,
            details=details
        )

class ValidationException(DomainException):
    def __init__(self, message: str, details: str = None):
        super().__init__(
            code="VALIDATION_ERROR",
            message=message,
            status_code=422,
            details=details
        )
