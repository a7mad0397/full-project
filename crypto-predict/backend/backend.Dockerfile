FROM python:3.11-slim
# Fix bcrypt / passlib backend issues
RUN apt-get update && apt-get install -y build-essential libffi-dev python3-dev


# إعدادات بيئية لتسريع وتشغيل بايثون بسلاسة
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملف المتطلبات وتثبيت الحزم
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install bcrypt==4.1.2
RUN python -m textblob.download_corpora

# نسخ باقي المشروع إلى داخل الحاوية
COPY . /app

# فتح منفذ 8000 للـ FastAPI
EXPOSE 8000
