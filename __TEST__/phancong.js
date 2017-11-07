/*eslint-disable */

PHANCONG={
    SoTuan: String,
    thoigian: Date,
    phancongtaixe:[
        {
            nhanvien:{
                type: ObjectID,
                ref: 'NHANVIEN'
            },
            ChuyenXe:{
                type: ObjectID,
                ref:'CHUYENXE'
            },
            thoigiancuthe: Date,
        }
    ],
    phancongkiemtra:[
        {
            nhanvien:{
                type: ObjectID,
                ref: 'NHANVIEN'
            },
            tuyenxe:{
                type: ObjectID,
                ref: 'TUYENXE'
            },
            thoigiancuthe: Date
        }
    ]
}