package com.ihz.repositories;

import com.ihz.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PostsRepository extends JpaRepository<Post, Integer> {

    public List<Post> findAllByOrderByCreatedAtDesc();

    public List<Post> findFirst5ByOrderByCreatedAtDesc();
}
