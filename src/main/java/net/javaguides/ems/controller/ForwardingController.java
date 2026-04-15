package net.javaguides.ems.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardingController {

    @RequestMapping(value = {
        "/login", "/employee-login", "/admin-login", "/register",
        "/admin-dashboard", "/employees", "/add-employee", "/edit-employee/**",
        "/employee-dashboard", "/employee-profile", "/attendance", "/search",
        "/leaves", "/admin/leaves", "/admin/attendance", "/employee-salary",
        "/admin/salaries", "/employee-worklogs", "/admin/work-reports",
        "/admin/assign-task", "/logout"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
