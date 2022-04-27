const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const render = require("./lib/htmlRenderer")
const fs = require("fs");


let employees = [];
inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of manager?",
            name: "managerName"
        },
        {
            type: "input",
            message: "What is the id of manager?",
            name: "managerId"
        },
        {
            type: "input",
            message: "What is the email address of manager?",
            name: "managerEmail"
        },
        {
            type: "input",
            message: "What is the office number of manager?",
            name: "managerOfficeNumber"
        },
    ])
    .then(function (response) {
        function askPosition() {
            inquirer
                .prompt([
                    {
                        type: "checkbox",
                        message: "What's the position of this employee?",
                        name: "position",
                        choices: [
                            "Engineer",
                            "Intern"
                        ]
                    }
                ])
                .then(function (resNext) {
                    // console.log(resNext.position[0]);
                    const resTemp = resNext.position;
                    if (resTemp.length > 1) {
                        console.log("You can only choose one at a time!")
                        askPosition();
                    } else {
                        if (resNext.position[0] === "Engineer") {
                            askEngineerInfo();
                        } else if (resNext.position[0] === "Intern") {
                            askInternInfo();
                        }
                    }
                })
        }
        function askEngineerInfo() {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What's the name of this engineer?",
                        name: "engineerName"
                    },
                    {
                        type: "input",
                        message: "What's the id of this engineer?",
                        name: "engineerId"
                    },
                    {
                        type: "input",
                        message: "What's the email address of this engineer?",
                        name: "engineerEmail"
                    },
                    {
                        type: "input",
                        message: "What's the github name of this engineer?",
                        name: "engineerGithub"
                    },
                ])
                .then(function (resEng) {
                    let engineer = new Engineer(resEng.engineerName, resEng.engineerId, resEng.engineerEmail, resEng.engineerGithub);
                    employees.push(engineer);
                    console.log("Engineer getRole: ", engineer.getRole());
                    console.log(employees);
                    ifMore();
                })
        }
        function askInternInfo() {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the name of the intern?",
                        name: "intName"
                    },
                    {
                        type: "input",
                        message: "What is the id of the intern?",
                        name: "intId"
                    },
                    {
                        type: "input",
                        message: "What is the email address of the intern?",
                        name: "intEmail"
                    },
                    {
                        type: "input",
                        message: "What school does the intern come from?",
                        name: "intSchool"
                    },
                ])
                .then(function (resInt) {
                    let intern = new Intern(resInt.intName, resInt.intId, resInt.intEmail, resInt.intSchool)
                    employees.push(intern);
                    console.log(employees);
                    console.log("Intern getRole: ", intern.getRole());
                    // console.log(resInt);
                    ifMore();
                })
        }
        function ifMore() {
            inquirer
                .prompt([
                    {
                        type: "checkbox",
                        message: "Any other employees?",
                        name: "ifMore",
                        choices: ["Yes","No"]
                    }
                ])
                .then(function (resIf) {
                    if (resIf.ifMore[0] === "Yes") {
                        askPosition();
                    }else{
                        var page = render(employees);
                        fs.writeFileSync("team.html", page,"utf8",function(err){
                            if (err) throw err;
                        })
                        console.log(page);
                        console.log("employee list generated!")
                    }
                })
        }
        function writeEmployee(employees) {
            const employeesJSON = JSON.stringify(employees, null, 2);
            fs.writeFileSync("employees.json", employeesJSON, function (err) {
                if (err) {
                    throw err;
                }
            })
        }
        let manager = new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeNumber)
        console.log("Manager getRole: ", manager.getRole());
        employees.push(manager);
        console.log(employees);
        ifMore();
        
    })