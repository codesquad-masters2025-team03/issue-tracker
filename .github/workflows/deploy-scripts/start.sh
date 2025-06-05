#!/bin/bash

cd /home/ubuntu/app/bundle

# ✅ .env 파일에서 환경 변수 로드
if [ -f .env ]; then
  echo "🔐 .env 파일에서 환경변수 불러오는 중..."
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env 파일을 찾을 수 없습니다. 종료합니다."
  exit 1
fi

echo "🚀 애플리케이션 실행 시작..."

nohup java \
  -Dspring.profiles.active=dev \
  -DJWT_ACCESS_KEY=$JWT_ACCESS_KEY \
  -DJWT_REFRESH_KEY=$JWT_REFRESH_KEY \
  -DAWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -DAWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -DAWS_REGION=$AWS_REGION \
  -Dcloud.aws.region.static=$AWS_REGION \
  -Dcloud.aws.s3.bucket=$S3_BUCKET_NAME \
  -Dcloud.aws.s3.url=$S3_URL_NAME \
  -Dspring.datasource.password=$DB_PASSWORD \
  -DOAUTH_CLIENT_ID=$OAUTH_CLIENT_ID \
  -DOAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET \
  -DOAUTH_REDIRECT_URI=$OAUTH_REDIRECT_URI \
  -jar app.jar > /home/ubuntu/app/app.log 2>&1 &
