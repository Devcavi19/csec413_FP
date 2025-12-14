"""
Vercel Serverless Function Entry Point
=======================================
This module serves as the entry point for the Flask application
when deployed on Vercel's serverless platform.
"""

from app import app

# Vercel requires the Flask app to be exposed as 'app'
# This is the WSGI application that Vercel will invoke
