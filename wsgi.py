"""
WSGI Configuration for PythonAnywhere Deployment
=================================================
This file configures the WSGI interface for deploying the Drop Ball Game
application on PythonAnywhere.

Instructions for PythonAnywhere:
1. Update the 'project_home' path below with your PythonAnywhere username
2. In PythonAnywhere Web tab, set WSGI configuration file to point to this file
3. Set virtualenv path to: /home/USERNAME/csec413_FP/env
4. Configure static files mapping: /static/ -> /home/USERNAME/csec413_FP/static/
"""

import sys
import os

# Add your project directory to the sys.path
# UPDATE THIS PATH with your PythonAnywhere username
project_home = '/home/USERNAME/csec413_FP'

if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import Flask app - 'application' is the variable name that WSGI expects
from app import app as application

# Optional: Set additional environment variables if needed
# os.environ['FLASK_ENV'] = 'production'
