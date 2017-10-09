# SERVER-API

** Bảo vệ xong sẽ viết doc dành riêng xây dựng RESTfull api và GraphQL **

# Nói sơ qua về sơ đồ phân dã chức năng
> Sơ đồ mức khung cảnh
![Sơ đồ phân dã chức năng](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/sodomucngucanh.png)


# Tại sao lại sử dụng Agenda để xây dựng Background Jobs

> Thay vì sử dụng Kue js, mình thay thế bằng Agenda vì nó sử dụng mongodb để lưu trữ jobs xây dựng core base code của nó nhỏ gọn, xây dựng trên event emmiter core của Nodejs( thằng kue sử dụng redis rất mạnh nhưng do hạn chế là nó ko cho phép interval job và perform không cao)

# Tại sao lại sử dụng socketio-jwt
![Chứng thực Cookies và chứng thực token](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/socketio-jwt.png)
