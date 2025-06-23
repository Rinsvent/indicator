build:
	docker build -t dh.rinsvent.ru/indicator ./

push:
	docker push dh.rinsvent.ru/indicator

deploy:
	ssh rinsvent@188.225.77.88 'bash -s' < ./bin/deploy

start-redis:
	docker compose -f=docker-compose.redis.yml up indicator_redis -d