package com.ihz.controllers;

import com.ihz.models.Document;
import com.ihz.models.Post;
import com.ihz.models.User;
import com.ihz.repositories.DocumentsRepository;
import com.ihz.repositories.PostsRepository;
import com.ihz.services.UserService;
import com.ihz.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/posts")
public class PostsController {

    @Autowired
    private UserService userService;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private DocumentsRepository documentsRepository;

    private final StorageService storageService;

    @Autowired
    public PostsController(StorageService storageService) {
        this.storageService = storageService;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "posts/index";
    }

    @RequestMapping(value = "/create", method = RequestMethod.GET)
    public String create() {
        return "posts/create";
    }


    @RequestMapping(value = "/{post}", method = RequestMethod.GET)
    public String show() {
        return "posts/show";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public Post store(@RequestBody Post post) {
        String userName = getPrincipal();
        User user = userService.findByName(userName);
        post.setUser(user);
        System.out.println(post.getUser().getName());
        return postsRepository.save(post);

    }

    @RequestMapping(value = "/{post}/upload", method = RequestMethod.POST)
    @ResponseBody
    public void upload(MultipartHttpServletRequest request, @PathVariable Integer post) throws IOException {
        Map<String, MultipartFile> fileMap = request.getFileMap();
        for (MultipartFile multipartFile : fileMap.values()) {
            storageService.store(multipartFile);
            Document document = new Document();
            document.setName(multipartFile.getOriginalFilename());
            document.setPath("/upload/" + multipartFile.getOriginalFilename());
            document.setExtension("pdf");
            document.setLink("/upload/" + multipartFile.getOriginalFilename());
            document.setPost(postsRepository.findOne(post));
            documentsRepository.save(document);
        }
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
