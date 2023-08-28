# About FriCore
**FriCore** bao gồm hệ thống Backend được xây dựng bằng ngôn ngữ PHP (Codeiginiter) kết hợp cùng với Javascript (ExpressJS, SocketIO), hệ thống Frontend sử dụng ngôn ngữ Javascript (ReactJS). Sử dụng song song 2 cơ sở dữ liệu là MySQL và Mongoose.

# Structure

 - Backend : folder code backend PHP Codeigniter - sử dụng composer để
   cài đặt thư viện 
 - Frontend : folder chứa code Frontend ReactJS - sử dụng yarn để cài
   đặt thư viện
 - Server : folder chưa code backend NodeJS - sử dụng yarn để cài đặt
   thư viện

## Enviroment
PHP Backend : PHP 7.4 or higher (Xampp/Nginx)
Nodejs/ReactJS : Nodejs 16 or higher

> Require Composer, Yarn for dependency install

## Installation

 1. Fork FriCore to your repository
 2. cd to Backend and run `composer install`
 3. cd to Server and run `yarn install`
 4. cd to Frontend and run `yarn install`
 5. cd to Backend/core and make a copy of env and rename to .env
 6. cd to Backend/applications/default make a copy of env and rename to .env then update .env with your infomation.
 7. cd to Server make a copy of env, env.development and rename to .env, .env.development and update your information.
 8. cd to Frontend make a copy of env, env.development and rename to .env, .env.development and update your information.
