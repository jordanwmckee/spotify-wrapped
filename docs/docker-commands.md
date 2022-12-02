## Useful Docker Commands for your reference


**For managing the sql server in the compose file, all you will really need to know is
how to start the containers,**

```bash
docker-compose up
```

view their running status,

```bash
docker ps
```

and to stop and resume them:

```bash
docker start mysql && \
docker start admin
```

```bash
docker stop mysql && \ 
docker stop admin
```

### Other commands

To see running containers. Here you can see the containers running/their names and id's
and which ports they are using

```bash
docker ps
```

To stop a container

```bash
docker stop <container name>
```

To start a container

```bash
docker start <container name>
```

To delete a container. Keep in mind, any information saved modified in the container will also be deleted.

```bash
docker rm <container name>
```

To show all images

```bash
docker images
```

To delete an image

```bash
docker image rm <image name or id>
```

To remove all containers and images not in use

```bash
docker system prune -af
```