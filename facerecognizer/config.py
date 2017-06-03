import json
import sys


CONFIG = json.loads(sys.argv[1]);

def get(key):
    return CONFIG[key]
