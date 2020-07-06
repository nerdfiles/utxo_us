#!/usr/bin/env python
import os
import sys

import django.core.management.commands.runserver as runserver
runserver.DEFAULT_PORT="443"

import os
dir_path = os.path.splitext(os.path.relpath(__file__))[0]
python_path = dir_path.replace(os.sep, ".")

print "Using %s with default port %s" % (python_path, runserver.DEFAULT_PORT)

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
