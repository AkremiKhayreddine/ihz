package com.ihz.controllers.api;

import com.ihz.models.Post;
import com.ihz.repositories.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostApiController {

    @Autowired
    private PostsRepository postsRepository;

    @RequestMapping(value = "")
    public List<Post> index() {
        return postsRepository.findAll();
    }

    @RequestMapping(value = "/{post}", method = RequestMethod.GET)
    public Post show(@PathVariable Integer post) {
        Post post1 = postsRepository.findOne(post);
        return post1;
    }

    @RequestMapping(value = "/{post}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Integer post) {
        postsRepository.delete(post);
    }
}
