package com.ihz.controllers;

import com.ihz.models.Message;
import com.ihz.repositories.MessagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {

    @Autowired
    private MessagesRepository messagesRepository;

    @RequestMapping("/")
    public String index() {
        return "index";
    }


    @RequestMapping(value = "/contact", method = RequestMethod.GET)
    public String contact() {
        return "contact";
    }

    @RequestMapping(value = "/contact", method = RequestMethod.POST)
    public void contact(@RequestBody Message message) {
        messagesRepository.save(message);
    }

    @RequestMapping(value = {"/404"}, method = RequestMethod.GET)
    public String NotFoudPage(ModelMap model) {
        model.addAttribute("loggedinuser", getPrincipal());
        return "error/pagenotfound";
    }

    public String getPrincipal() {
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            userName = ((UserDetails) principal).getUsername();
        } else {
            userName = principal.toString();
        }
        return userName;
    }
}
