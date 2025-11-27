FROM python:3.12-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY cash-register-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the necessary files for data loading
COPY cash-register-service/db/ ./db/
COPY cash-register-service/load_data.py .
COPY cash-register-service/data/ ./data/

# Set environment variable
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/supermarket

CMD ["python", "load_data.py"]

