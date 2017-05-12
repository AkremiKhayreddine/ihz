package com.ihz.repositories;

import com.ihz.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationsRepository extends JpaRepository<Notification, Integer> {
}
