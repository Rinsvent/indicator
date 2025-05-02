build:
	docker build -t dh.rinsvent.ru/indicator ./

push:
	docker push dh.rinsvent.ru/indicator

deploy:
	ssh root@188.225.77.88 'bash -s' < ./bin/deploy