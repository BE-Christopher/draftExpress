import { Request, Response } from "express";

const regions = [
    { id: 1, name: "Hà Nội" },
    { id: 2, name: "Hồ Chí Minh" },
    { id: 3, name: "Đà Nẵng" },
    { id: 4, name: "Hải Phòng" },
    { id: 5, name: "Cần Thơ" },
    { id: 6, name: "An Giang" },
    { id: 7, name: "Bà Rịa - Vũng Tàu" },
    { id: 8, name: "Bạc Liêu" },
    { id: 9, name: "Bắc Giang" },
    { id: 10, name: "Bắc Kạn" },
    { id: 11, name: "Bắc Ninh" },
    { id: 12, name: "Bến Tre" },
    { id: 13, name: "Bình Định" },
    { id: 14, name: "Bình Dương" },
    { id: 15, name: "Bình Phước" },
    { id: 16, name: "Bình Thuận" },
    { id: 17, name: "Cà Mau" },
    { id: 18, name: "Cao Bằng" },
    { id: 19, name: "Đắk Lắk" },
    { id: 20, name: "Đắk Nông" },
    { id: 21, name: "Điện Biên" },
    { id: 22, name: "Đồng Nai" },
    { id: 23, name: "Đồng Tháp" },
    { id: 24, name: "Gia Lai" },
    { id: 25, name: "Hà Giang" },
    { id: 26, name: "Hà Nam" },
    { id: 27, name: "Hà Tĩnh" },
    { id: 28, name: "Hải Dương" },
    { id: 29, name: "Hậu Giang" },
    { id: 30, name: "Hòa Bình" },
    { id: 31, name: "Hưng Yên" },
    { id: 32, name: "Khánh Hòa" },
    { id: 33, name: "Kiên Giang" },
    { id: 34, name: "Kon Tum" },
    { id: 35, name: "Lai Châu" },
    { id: 36, name: "Lâm Đồng" },
    { id: 37, name: "Lạng Sơn" },
    { id: 38, name: "Lào Cai" },
    { id: 39, name: "Long An" },
    { id: 40, name: "Nam Định" },
    { id: 41, name: "Nghệ An" },
    { id: 42, name: "Ninh Bình" },
    { id: 43, name: "Ninh Thuận" },
    { id: 44, name: "Phú Thọ" },
    { id: 45, name: "Quảng Bình" },
    { id: 46, name: "Quảng Nam" },
    { id: 47, name: "Quảng Ngãi" },
    { id: 48, name: "Quảng Ninh" },
    { id: 49, name: "Quảng Trị" },
    { id: 50, name: "Sóc Trăng" },
    { id: 51, name: "Sơn La" },
    { id: 52, name: "Tây Ninh" },
    { id: 53, name: "Thái Bình" },
    { id: 54, name: "Thái Nguyên" },
    { id: 55, name: "Thanh Hóa" },
    { id: 56, name: "Thừa Thiên Huế" },
    { id: 57, name: "Tiền Giang" },
    { id: 58, name: "Trà Vinh" },
    { id: 59, name: "Tuyên Quang" },
    { id: 60, name: "Vĩnh Long" },
    { id: 61, name: "Vĩnh Phúc" },
    { id: 62, name: "Yên Bái" },
    { id: 63, name: "Đắk Nông" }
];

class DemoController {
    async getDemo(req: Request, res: Response) {
        try {

        } catch (error) {
            console.log("🚀 ~ DemoController ~ getDemo ~ error:", error);
            res.send('error');
        }
    }
}

export default new DemoController();
