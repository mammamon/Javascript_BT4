//Utilities
function getElement(selector) {
    return document.querySelector(selector)
}
//------------------------------------------------------------------------------------------------//
//MODEL
//CONSTRUCTOR FUNCTIONS
function Staff(_userName, _fullName, _email, _password, _date, _wage, _position, _workingHours) {
    this.username = _username,
        this.fullName = _fullName,
        this.email = _email,
        this.password = _password,
        this.date = _date,
        this.wage = _wage,
        this.position = _position,
        this.workingHours = _workingHours,
        //phương thức tính tổng lương nhân viên
        this.totalWage = function () {
            var bonus;
            switch (this.position) {
                case 'Sếp':
                    bonus = 3;
                    break;
                case 'Trưởng phòng':
                    bonus = 2;
                    break;
                default:
                    bonus = 1;
            }
            return this.workingHours * this.wage * bonus;
        },
        //phương thức xếp loại nhân viên
        this.rating = function () {
            if (this.workingHours >= 192) {
                return "nhân viên xuất sắc";
            } else if (this.workingHours >= 176) {
                return "nhân viên giỏi";
            } else if (this.workingHours >= 160) {
                return "nhân viên khá";
            } else {
                return "nhân viên trung bình";
            }
        }
};

function StaffList() {
    this.arrStaff = [];
    //Add new staff
    this.addStaff = function (staff){
        this.arrStaff.push(staff);
    }
}
//------------------------------------------------------------------------------------------------//

//Create new staff based on Staff() 
var staff = new Staff();

//Add new staff to the table



// Get inputs from users
function getInput() {
    var userName = getElement('#userName').value
    var fullName = getElement('#fullName').value
    var email = getElement('#email').value
    var password = getElement('#password').value
    var date = getElement('#date').value
    var wage = +getElement('#wage').value
    var position = getElement('#position').value
    var workingHours = +getElement('#workingHours').value
    var staff = new Staff(
        userName,
        fullName,
        email,
        password,
        date,
        wage,
        position,
        workingHours
    )

    return staff;
}


// Render StaffList ra giao diện
function render() {
    var content = ''
    for (var i = 0; i < dssv.arrStaff.length; i++) {
        var sv = dssv.arrStaff[i]
        content += `
            <tr>
                <td>${sv.maSV}</td>
                <td>${sv.tenSV}</td>
                <td>${sv.email}</td>
                <td>${sv.ngaySinh}</td>
                <td>${sv.khoaHoc}</td>
                <td>${sv.tinhDTB()}</td>
                <td>
                    <button 
                        class='btn btn-success mr-3'
                        onclick="updateSV('${sv.maSV}')"
                    >
                        Edit
                    </button>
                    <button class='btn btn-danger' onclick="deleteSV('${sv.maSV}')">Delete</button>
                </td>
            </tr>
        `
    }
}

// Save StaffList vào local Storage
function setLocalStorage() {
    localStorage.setItem('StaffList', JSON.stringify(StaffList.arrStaff));
}

// Get StaffList từ  local Storage
function getLocalStorage() {
    //B1: lấy data từ local
    var data = localStorage.getItem('DSSV') // null

    //B2: parse data về kiểu dữ liệu ban đầu
    if (data) {
        var parseData = JSON.parse(data)
        // console.log('parseData: ', parseData)

        // Tạo lại đối tượng sinhVien từ lớp đối SinhVien để lấy lại phương thức tinhDTB
        //B1: tạo mảng rỗng để lưu dssv
        var arr = []

        // B2: duyệt mảng đc lấy từ local
        for (var i = 0; i < parseData.length; i++) {
            var sv = parseData[i]
            console.log('sv: ', sv)
            // tạo lại đối tượng sv từ lớp đối tượng SV
            var sinhVien = new SinhVien(
                sv.maSV,
                sv.tenSV,
                sv.email,
                sv.matKhau,
                sv.ngaySinh,
                sv.khoaHoc,
                sv.diemToan,
                sv.diemLy,
                sv.diemHoa
            )
            // thêm sinhVien vào mảng arr
            arr.push(sinhVien)
        }

        // gán giá trị cho mảng arrStaff từ data lấy từ localStorage
        dssv.arrStaff = arr
        console.log('arr: ', arr)
        renderdssv()
    }
}