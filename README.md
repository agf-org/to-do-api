# To-do API

### Local usage
```
$ npm start
```
Run linter:
```
$ npm run eslint
```
Run unit tests:
```
$ npm test
```

### Docker usage
Build image:
```
$ docker build \
    --file $HOME/repositories/to-do-api/Dockerfile \
    --tag alvarogarciafer/to-do-api \
    $HOME/repositories/to-do-api
```
Stop and remove container:
```
$ docker container stop to-do-api
$ docker container rm to-do-api
```
Run container:
```
$ docker container run \
    --publish 3000:3000 \
    --name to-do-api \
    --rm \
    --detach \
    alvarogarciafer/to-do-api \
    start
```
Check logs:
```
$ docker container logs \
    --follow \
    to-do-api
```
