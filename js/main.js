//------------------------ UTILITIES ------------------------//

function getElement(selector) {
    return document.querySelector(selector)
}


//------------------------ MODEL ------------------------//

//constructor Staff
function Staff(_userName, _fullName, _email, _password, _date, _wage, _position, _workingHours) {
    this.userName = _userName,
        this.fullName = _fullName,
        this.email = _email,
        this.password = _password,
        this.date = _date,
        this.wage = _wage,
        this.position = _position,
        this.workingHours = _workingHours,
        //method tính tổng lương
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
            return this.wage * bonus;
        },
        //method xếp loại nhân viên
        this.rating = function () {
            if (this.workingHours >= 192) {
                return "xuất sắc";
            } else if (this.workingHours >= 176) {
                return "giỏi";
            } else if (this.workingHours >= 160) {
                return "khá";
            } else {
                return "trung bình";
            }
        }
};

//constructor StaffList
function StaffList() {
    this.arrStaff = [];
    //thêm staff mới
    this.addNewStaff = function (staff) {
        this.arrStaff.push(staff);
    }
    //xóa staff hiện có
    this.deleteStaff = function (index) {
        this.arrStaff.splice(index, 1);
    }
    //sửa staff
    this.editStaff = function (index, newInfo) {
        var staff = this.arrStaff[index];
        if (staff) {
            staff.fullName = newInfo.fullName;
            staff.email = newInfo.email;
            staff.date = newInfo.date;
            staff.position = newInfo.position;
            staff.wage = newInfo.wage;
            staff.workingHours = newInfo.workingHours;
        }
    }
}

var staffList = new StaffList();


//------------------------ VIEW ------------------------//

// Render StaffList
function render() {
    var content = '';
    for (var i = 0; i < staffList.arrStaff.length; i++) {
        var staff = staffList.arrStaff[i];
        content += `
            <tr>
                <td>${staff.userName}</td>
                <td>${staff.fullName}</td>
                <td>${staff.email}</td>
                <td>${staff.date}</td>
                <td>${staff.position}</td>
                <td>${staff.totalWage()}</td>
                <td class="rating">${staff.rating()}</td>
                <td class = "btn-staff d-flex">
                    <button class ="btn btn-success mr-2" data-toggle="modal" data-target="#myModal" onclick="editStaff(${i})">Edit</button>
                    <button class ="btn btn-danger" onclick="deleteStaff(${i})">Xóa</button>
                </td>
            </tr>
        `;
    }
    getElement('#tableDanhSach').innerHTML = content;
}


//------------------------ VALIDATION ------------------------//

function validation(userName, fullName, email, password, date, wage, position, workingHours, duplicateUserName) {
    var isValid = true;
    // Check inputs trống
    if (!userName || !fullName || !email || !password || !date || !wage || !position || !workingHours) {
        isValid = false;
        alert('Vui lòng nhập đầy đủ thông tin');
    }

    var staffList = JSON.parse(localStorage.getItem('staffList'));
    if (staffList === null) {
        staffList = [];
    } else {
        staffList = staffList.arrStaff;
    }
    // Check userName
    if (userName.length < 4 || userName.length > 6 || isNaN(userName)) {
        isValid = false;
        getElement('#check-userName').innerHTML = 'Tài khoản phải là dãy số từ 4 đến 6 số';
        // bỏ kiểm tra trùng userName khi cập nhật
    } else if (duplicateUserName && staffList.some(function (staff) { return staff.userName === userName; })) {
        isValid = false;
        getElement('#check-userName').innerHTML = 'Tài khoản đã tồn tại';
    } else {
        getElement('#check-userName').innerHTML = '';
    }
    // Check fullName
    if (!/^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(fullName)) {
        isValid = false;
        getElement('#check-fullName').innerHTML = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
    } else {
        getElement('#check-fullName').innerHTML = '';
    }
    // Check email
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        isValid = false;
        getElement('#check-email').innerHTML = 'Sai định dạng email';
    } else {
        getElement('#check-email').innerHTML = '';
    }
    // Check password
    if (password.length < 6 || password.length > 10) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Mật khẩu từ 6 đến 10 kí tự';
    } else if (!/[a-z]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Mật khẩu phải chứa ít nhất 1 chữ cái viết thường';
    } else if (!/[A-Z]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa';
    } else if (!/[0-9]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Mật khẩu phải chứa ít nhất 1 chữ số';
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt';
    } else {
        getElement('#check-password').innerHTML = '';
    }
    // Check date
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
        isValid = false;
        getElement('#check-date').innerHTML = 'Định dạng ngày làm theo tháng/ngày/năm -  mm/dd/yyyy';
    } else {
        var dateParts = date.split('/');
        var month = parseInt(dateParts[0], 10);
        var day = parseInt(dateParts[1], 10);
        var year = parseInt(dateParts[2], 10);
        var dateObj = new Date(year, month - 1, day);
        if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
            isValid = false;
            getElement('#check-date').innerHTML = 'Tháng/ngày/năm nhập không hợp lệ';
        } else {
            getElement('#check-date').innerHTML = '';
        }
    }
    // Check wage
    if (wage < 1e+6 || wage > 20e+6) {
        isValid = false;
        getElement('#check-wage').innerHTML = 'Lương cơ bản phải nằm trong khoảng từ 1 đến 20 triệu';
    } else {
        getElement('#check-wage').innerHTML = '';
    }
    // Check position
    if (['Sếp', 'Trưởng phòng', 'Nhân viên'].indexOf(position) === -1) {
        isValid = false;
        getElement('#check-position').innerHTML = 'Vui lòng chọn 1 trong 3 chức vụ';
    } else {
        getElement('#check-position').innerHTML = '';
    }
    // Check workingHours
    if (workingHours < 80 || workingHours > 200) {
        isValid = false;
        getElement('#check-workingHours').innerHTML = 'Số giờ làm phải nằm trong khoảng từ 80 đến 200 giờ';
    } else {
        getElement('#check-workingHours').innerHTML = ' '
    }
    return isValid;
}


//------------------------ LOCAL STORAGE ------------------------//

// lưu staffList vào local storage
function localStorageSave() {
    localStorage.setItem('staffList', JSON.stringify(staffList));
}

// load staffList từ local storage
function localStorageLoad() {
    var data = localStorage.getItem('staffList');
    if (data) {
        staffList = new StaffList();
        staffList.arrStaff = JSON.parse(data).arrStaff;
        // Tạo lại 2 method totalWage() và rating()
        for (var i = 0; i < staffList.arrStaff.length; i++) {
            staffList.arrStaff[i].totalWage = function () {
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
                return this.wage * bonus;
            };
            staffList.arrStaff[i].rating = function () {
                if (this.workingHours >= 192) {
                    return "xuất sắc";
                } else if (this.workingHours >= 176) {
                    return "giỏi";
                } else if (this.workingHours >= 160) {
                    return "khá";
                } else {
                    return "trung bình";
                }
            };
        }
    }
    render();
}
localStorageLoad();


//------------------------ CONTROLLER ------------------------//

//Thêm staff mới vào mảng
getElement('#btnThemNV').onclick = function () {
    var userName = getElement('#userName').value;
    var fullName = getElement('#fullName').value;
    var email = getElement('#email').value;
    var password = getElement('#password').value;
    var date = getElement('#date').value;
    var wage = +getElement('#wage').value;
    var position = getElement('#position').value;
    var workingHours = +getElement('#workingHours').value;
    //check valid có kiểm tra trùng username (duplicateUserName = true)
    if (validation(userName, fullName, email, password, date, wage, position, workingHours, true)) {
        var staff = new Staff(
            userName,
            fullName,
            email,
            password,
            date,
            wage,
            position,
            workingHours
        );
        staffList.addNewStaff(staff);
        render();
        localStorageSave();
        getElement('#form').reset();
    }
}

//Xóa staff ra khỏi mảng
function deleteStaff(index) {
    staffList.deleteStaff(index);
    render();
    localStorageSave();
}

//sửa staff hiện có dựa trên index
var currentIndex;
function editStaff(index) {
    var staff = staffList.arrStaff[index];
    // hiện lại các giá trị của input trong modal 
    getElement('#userName').value = staff.userName;
    getElement('#fullName').value = staff.fullName;
    getElement('#email').value = staff.email;
    getElement('#password').value = staff.password;
    getElement('#date').value = staff.date;
    getElement('#position').value = staff.position;
    getElement('#wage').value = staff.wage;
    getElement('#workingHours').value = staff.workingHours;
    //ẩn nút thêm hiện nút cập nhật
    getElement('#btnThemNV').style.display = 'none';
    getElement('#btnCapNhat').style.display = 'block';
    currentIndex = index;
}
getElement('#btnCapNhat').onclick = function () {
    // lấy input từ modal 
    var userName = getElement('#userName').value;
    var fullName = getElement('#fullName').value;
    var email = getElement('#email').value;
    var password = getElement('#password').value;
    var date = getElement('#date').value;
    var wage = +getElement('#wage').value;
    var position = getElement('#position').value;
    var workingHours = +getElement('#workingHours').value;
    //check valid không kiểm tra trùng username (duplicateUserName = false)
    if (validation(userName, fullName, email, password, date, wage, position, workingHours, false)) {
        var staff = staffList.arrStaff[currentIndex];
        staff.userName = userName;
        staff.fullName = fullName;
        staff.email = email;
        staff.password = password;
        staff.date = date;
        staff.position = position;
        staff.wage = wage;
        staff.workingHours = workingHours;
        render();
        localStorageSave();
        getElement('#form').reset();
    }
}

//tìm kiếm staff dựa trên xếp loại
getElement('#searchName').addEventListener('input', function () {
    var searchValue = getElement('#searchName').value;
    var tableRows = document.querySelectorAll('tr');
    for (var i = 0; i < tableRows.length; i++) {
        var rating = tableRows[i].querySelector('.rating');
        if (rating) {
            if (searchValue && ["xuất sắc", "giỏi", "khá", "trung bình"].includes(searchValue) && rating.textContent === searchValue) {
                tableRows[i].style.display = '';
            } else if (!searchValue || !["xuất sắc", "giỏi", "khá", "trung bình"].includes(searchValue)) {
                tableRows[i].style.display = '';
            } else {
                tableRows[i].style.display = 'none';
            }
        }
    }
});

// ẩn nút cập nhật hiện nút thêm
getElement('#btnThem').onclick = function () {
    getElement('#btnThemNV').style.display = 'block';
    getElement('#btnCapNhat').style.display = 'none';
};