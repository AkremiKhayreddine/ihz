package com.ihz.controllers.api;

import com.ihz.models.User;
import com.ihz.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersApiController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<User> index() {
        return userRepository.findAll();
    }
}
