# SERVER-API

** Bảo vệ xong sẽ viết doc dành riêng xây dựng RESTfull api và GraphQL **

# Phân tích thiết kế hệ thống
## 1 Xác định chức năng
### Bảng xác định chức năng

STT          | Tên chức năng
-------------| --------------
`1`          | Cập nhật tài khoản nhân viên, quản lý
`2`          | Cập nhật tài khoản khách hàng
`3`          | Cập nhật xe
`4`          | Cập nhật tuyến xe
`5`          | Quản lý thông tin khách hàng
`6`          | Quản lý nhân viên
`7`          | Cập nhật mã giảm giá
`8`          | Cập nhật chuyến xe
`9`          | Cập nhật lộ trình
`10`          | Cập nhật vé
`11`          | Giám sát tình trạng giao thông
`12`          | Đăng ký, hủy chuyến
`13`          | Quản lý phản hồi
`14`          | Cập nhật chỗ ngồi
`15`          | Thống kê khách hàng
`16`          | Thống kê doanh thu


## 2 Gom nhóm chức năng
### Bảng gom nhóm chức năng

![Bảng phân nhóm chức năng](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/phannhomchucnang.png)

## 3 Sơ đồ phân rã chức năng
>Sơ đồ phân rã chức năng
![Sơ đồ phân dã chức năng](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/sodophanrachucnang.png)

## 3 DFD mức khung cảnh
### Sơ đồ mức khung cảnh
![Sơ đồ mức khung cảnh](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/sodomucngucanh.png)

> Sơ đồ luồng dữ liệu mức khung cảnh liệt kê các tương tác từ phía người dùng và sự phản hồi của ứng dụng ngược trở lại.



## 4 DFD mức đỉnh
![Sơ đồ phân dã chức năng](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/mucdinh-11-10-2017.png)

Sơ đồ luồng dữ liệu mức đỉnh phân tích các tương tác của người dùng với các nhóm chức năng của ứng dụng và sự ảnh hưởng tới kho dữ liệu:
`−	Nhóm chức năng Quản lý tài khoản`
`−	Nhóm chức năng Quản lý thông tin`
`−	Nhóm chức năng Quản lý chuyến xe`
`−	Nhóm chức năng Báo cáo thống kê`
## 5 DFD mức dưới đỉnh
### 5.1 DFD quản lý tài khoản
Sơ đồ luồng dữ liệu của Quản lý Tài khoản mô tả các tương tác của người dùng đến nhóm chức năng Quản lý Tài khoản.

![DFD cập nhật thông tin tài khoản khách hàng](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/Sodomucduoidinh-capnhattaikhoannguoidung.png)

> DFD quản lý cập nhật thông tin tài khoản khách hàng

![DFD cập nhật thông tin tài khoản quản trị](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/sodomucduoidinh_quanlycapnhatquanly.png)

>DFD quản lý cập nhật thông tin tài khoản quản trị

### 5.2 DFD quản lý thông tin

![DFD dưới đỉnh quản lý thông tin](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/sodomucduoidinh_quanlythongtin.png)

> DFD dưới đỉnh quản lý thông tin

### 5.2 DFD quản lý Chuyến xe
![DFD dưới đỉnh quản lý chuyen xe](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/sodomucduoidinh_quanlychuyenxe.png)
 > DFD quản lý Chuyến xe

 ### 5.4 DFD Báo cáo thống kê

![DFD dưới đỉnh quản lý thống kê](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/sodomucduoidinh_quanlythongke.png)
 > DFD quản lý Thống kê










# Tại sao lại sử dụng Agenda để xây dựng Background Jobs

> Thay vì sử dụng Kue js, mình thay thế bằng Agenda vì nó sử dụng mongodb để lưu trữ jobs xây dựng core base code của nó nhỏ gọn, xây dựng trên event emmiter core của Nodejs( thằng kue sử dụng redis rất mạnh nhưng do hạn chế là nó ko cho phép interval job và perform không cao)

# Tại sao lại sử dụng socketio-jwt
![Chứng thực Cookies và chứng thực token](https://raw.githubusercontent.com/thanhpcc96/SERVER-API/master/screenshot/socketio-jwt.png)
