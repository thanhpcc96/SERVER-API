# SERVER-API

** Bảo vệ xong sẽ viết doc dành riêng xây dựng RESTfull api và GraphQL **

# Tại sao lại sử dụng Agenda để xây dựng Background Jobs

> Thay vì sử dụng Kue js, mình thay thế bằng Agenda vì nó sử dụng mongodb để lưu trữ jobs xây dựng core base code của nó nhỏ gọn, xây dựng trên event emmiter core của Nodejs( thằng kue sử dụng redis rất mạnh nhưng do hạn chế là nó ko cho phép interval job và perform không cao)

