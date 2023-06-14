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
            return this.workingHours * this.wage * bonus;
        },
        //method xếp loại nhân viên
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

//constructor StaffList
function StaffList() {
    this.arrStaff = [];
    //thêm dữ liệu mới
    this.addNewStaff = function (staff) {
        this.arrStaff.push(staff);
    }
}
var staffList = new StaffList();


//------------------------ VIEW ------------------------//
// Render StaffList
function render() {
    var content = '';
    console.log(staffList.arrStaff);
    for (var i = 0; i < staffList.arrStaff.length; i++) {
        var staff = staffList.arrStaff[i];
        console.log(staff);
        content += `
            <tr>
                <td>${staff.userName}</td>
                <td>${staff.fullName}</td>
                <td>${staff.email}</td>
                <td>${staff.date}</td>
                <td>${staff.position}</td>
                <td>${staff.totalWage()}</td>
                <td>${staff.rating()}</td>
            </tr>
        `;
    }
    getElement('#tableDanhSach').innerHTML = content;
}
localStorageLoad();
//------------------------ VALIDATION ------------------------//
function getInput() {
    var userName = getElement('#userName').value;
    var fullName = getElement('#fullName').value;
    var email = getElement('#email').value;
    var password = getElement('#password').value;
    var date = getElement('#date').value;
    var wage = +getElement('#wage').value;
    var position = getElement('#position').value;
    var workingHours = +getElement('#workingHours').value;
    // Validation
    var isValid = true;
    // Check blank inputs
    if (!userName || !fullName || !email || !password || !date || !wage || !position || !workingHours) {
        isValid = false;
        alert('Vui lòng nhập đầy đủ thông tin');
    }
    // Check userName
    if (userName.length < 4 || userName.length > 6 || isNaN(userName)) {
        isValid = false;
        getElement('#check-userName').innerHTML = 'Tài khoản phải là dãy số từ 4 đến 6 số';
    } else {
        getElement('#check-userName').innerHTML = '';
    }
    // Check fullName
    if (!/^[a-zA-Z\s\u00C0-\u1EF9]*$/.test(fullName)) {
        isValid = false;
        getElement('#check-fullName').innerHTML = 'Full name must contain only letters and spaces';
    } else {
        getElement('#check-fullName').innerHTML = '';
    }
    // Check email
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        isValid = false;
        getElement('#check-email').innerHTML = 'Email must be in a valid format';
    } else {
        getElement('#check-email').innerHTML = '';
    }
    // Check password
    if (password.length < 6 || password.length > 10) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Password must be between 6 and 10 characters';
    } else if (!/[a-z]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Password must contain at least one lowercase letter';
    } else if (!/[A-Z]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Password must contain at least one number';
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
        isValid = false;
        getElement('#check-password').innerHTML = 'Password must contain at least one special character';
    } else {
        getElement('#check-password').innerHTML = '';
    }
    // Check date
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
        isValid = false;
        getElement('#check-date').innerHTML = 'Date must be in the format mm/dd/yyyy';
    } else {
        getElement('#check-date').innerHTML = '';
    }
    // Check wage
    if (wage < 1e6 || wage > 20e6) {
        isValid = false;
        getElement('#check-wage').innerHTML = 'Wage must be between 1e6 and 20e6';
    } else {
        getElement('#check-wage').innerHTML = '';
    }
    // Check position
    if (['Sếp', 'Trưởng phòng', 'Nhân viên'].indexOf(position) === -1) {
        isValid = false;
        getElement('#check-position').innerHTML = 'Please select a valid position';
    } else {
        getElement('#check-position').innerHTML = '';
    }
    // Check workingHours
    if (workingHours < 80 || workingHours > 200) {
        isValid = false;
        getElement('#check-workingHours').innerHTML = 'Working hours must be between 80 and 200';
    } else {
        getElement('#check-workingHours').innerHTML = ' '
    }
    // only add new Staff when isValid = true
    console.log(isValid);
    if (isValid) {
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
        return staff;
    } else {
        return;
    }
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
                return this.workingHours * this.wage * bonus;
            };
            staffList.arrStaff[i].rating = function () {
                if (this.workingHours >= 192) {
                    return "nhân viên xuất sắc";
                } else if (this.workingHours >= 176) {
                    return "nhân viên giỏi";
                } else if (this.workingHours >= 160) {
                    return "nhân viên khá";
                } else {
                    return "nhân viên trung bình";
                }
            };
        }
    }
    render();
}
//------------------------ CONTROLLER ------------------------//
//Thêm staff mới vào bảng
getElement('#btnThemNV').onclick = function () {
    var staff = getInput();
    if (staff) {
        staffList.addNewStaff(staff);
        render();
        localStorageSave();
        getElement('#form').reset();
    };
}