FROM node: 8.4.0

MAINTAINER ThanhPham <thanhpcc1996@gmail.com>

# tao thu muc app trong container
RUN mkdir -p /app

# Dat /app lam thu muc lam viec mac dinh 
WORKDIR /app

ADD package.json yarn.lock /app/

# --pure-lockfile: Khong cho generate file khoa cua yarn: yarn.lock
RUN yarn --pure-lockfile
RUN yarn global add pm2

# sao chep tat ca cac file trong thu muc hien tai tru file 
# nao duoc loai tru trong .dockerignore
COPY . /app/

#expose chay tren cong 3000
EXPOSE 3000

#lenh chay app
CMD ["pm2","start","processes.json","--no-daemon"]