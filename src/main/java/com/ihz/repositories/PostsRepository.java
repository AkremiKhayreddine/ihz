package com.ihz.repositories;

import com.ihz.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PostsRepository extends JpaRepository<Post, Integer> {
}
