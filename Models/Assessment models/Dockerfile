# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies with user flag to avoid externally-managed-environment
RUN pip install --user --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8000

# Set environment variable
ENV PORT=8000
ENV PYTHONPATH=/root/.local/lib/python3.11/site-packages:$PYTHONPATH

# Start the application
CMD ["python", "start.py"] 