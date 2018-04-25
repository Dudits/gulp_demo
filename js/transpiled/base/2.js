"use strict";

function getDailySalary() {
    var workingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
    var hourlyWage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;

    return workingHours * hourlyWage;
}