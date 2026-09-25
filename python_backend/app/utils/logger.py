import logging
import json
import sys

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "level": record.levelname.lower(),
            "msg": record.getMessage(),
            "time": self.formatTime(record, self.datefmt),
        }
        if hasattr(record, "correlationId"):
            log_record["correlationId"] = record.correlationId
        return json.dumps(log_record)

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)
