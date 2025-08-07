
# Base image // version của image muốn kéo về 
FROM node:20-alpine
# chuẩn bị môi trường nodejs , version 16 alpine : giảm dung luong khi build vs docker

# Create app directory
# nơi lưu trữ source code
WORKDIR /hoidanit/backend-nest


# A wildcard is used to ensure both package.json AND package-lock.json are copied 
# copy từ máy ném vô docker 
COPY package*.json ./
# Install app dependencies
# cài đặt node module
RUN npm install --legacy-peer-deps

RUN npm i -g @nestjs/cli@10.0.3
# 4 phần đầu sẽ đc catching lại , chỉ khi nào thay đổi packetjon mới chạy câu lệnh trên 
# Bundle app source
# copy all file còn lại vào trogn docker tại thư mục DockerFile đang đứng 
COPY . .
#Create a "dist" forder with the production build
RUN npm run build 

#Start the server using the production build
CMD ["node","dist/main.js"]
